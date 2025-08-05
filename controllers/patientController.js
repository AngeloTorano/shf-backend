const db = require("../config/database")
const ResponseHandler = require("../utils/responseHandler")

class PatientController {
  static async createPatient(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const patientData = req.body

      // Generate SHF ID if not provided
      if (!patientData.shf_id) {
        // Get the highest existing numeric ID
        const result = await db.query(`
    SELECT MAX(CAST(SUBSTRING(shf_id FROM 5) AS INTEGER)) AS max_id 
    FROM patients 
    WHERE shf_id ~ '^SHF-[0-9]+$'
  `);

        let nextId = 1; // Default starting ID

        if (result.rows[0].max_id) {
          nextId = result.rows[0].max_id + 1;
        }

        // Format as 6-digit number with leading zeros
        patientData.shf_id = `SHF-${String(nextId).padStart(6, '0')}`;
      }
      const columns = Object.keys(patientData).join(", ")
      const placeholders = Object.keys(patientData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(patientData)

      const query = `
        INSERT INTO patients (${columns})
        VALUES (${placeholders})
        RETURNING patient_id, shf_id
      `

      const result = await client.query(query, values)
      const patient = result.rows[0]

      // Create initial phase entry for Phase 1
      await client.query(
        "INSERT INTO patient_phases (patient_id, phase_id, phase_start_date, status, completed_by_user_id) VALUES ($1, $2, CURRENT_DATE, $3, $4)",
        [patient.patient_id, 1, "In Progress", req.user.user_id],
      )

      // Log patient creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["patients", patient.patient_id, "CREATE", JSON.stringify(patientData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, patient, "Patient created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create patient error:", error)
      return ResponseHandler.error(res, "Failed to create patient")
    } finally {
      client.release()
    }
  }

  static async getPatients(req, res) {
    try {
      const { page = 1, limit = 10, search, city, country, phase_id, status } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT p.*, pp.phase_id, pp.status as phase_status, ph.phase_name,
               pp.phase_start_date, pp.phase_end_date
        FROM patients p
        LEFT JOIN patient_phases pp ON p.patient_id = pp.patient_id
        LEFT JOIN phases ph ON pp.phase_id = ph.phase_id
      `

      const conditions = []
      const params = []

      // Apply location-based filtering for non-admin users
      if (!req.user.roles.includes("admin")) {
        if (req.user.roles.includes("city_coordinator")) {
          const userCities = req.user.locations.filter((loc) => loc.city_id).map((loc) => loc.city_name)

          if (userCities.length > 0) {
            conditions.push(`p.city_village = ANY($${params.length + 1})`)
            params.push(userCities)
          }
        } else if (req.user.roles.includes("country_coordinator")) {
          const userCountries = req.user.locations.filter((loc) => loc.country_id).map((loc) => loc.country_name)

          if (userCountries.length > 0) {
            conditions.push(`p.region_district = ANY($${params.length + 1})`)
            params.push(userCountries)
          }
        }
      }

      if (search) {
        conditions.push(
          `(p.first_name ILIKE $${params.length + 1} OR p.last_name ILIKE $${params.length + 1} OR p.shf_id ILIKE $${params.length + 1})`,
        )
        params.push(`%${search}%`)
      }

      if (city) {
        conditions.push(`p.city_village = $${params.length + 1}`)
        params.push(city)
      }

      if (country) {
        conditions.push(`p.region_district = $${params.length + 1}`)
        params.push(country)
      }

      if (phase_id) {
        conditions.push(`pp.phase_id = $${params.length + 1}`)
        params.push(phase_id)
      }

      if (status) {
        conditions.push(`pp.status = $${params.length + 1}`)
        params.push(status)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Patients retrieved successfully")
    } catch (error) {
      console.error("Get patients error:", error)
      return ResponseHandler.error(res, "Failed to retrieve patients")
    }
  }

  static async getPatientById(req, res) {
    try {
      const { patientId } = req.params

      const query = `
        SELECT p.*, 
               array_agg(
                 json_build_object(
                   'phase_id', pp.phase_id,
                   'phase_name', ph.phase_name,
                   'status', pp.status,
                   'start_date', pp.phase_start_date,
                   'end_date', pp.phase_end_date,
                   'completed_by', u.username
                 )
               ) as phases
        FROM patients p
        LEFT JOIN patient_phases pp ON p.patient_id = pp.patient_id
        LEFT JOIN phases ph ON pp.phase_id = ph.phase_id
        LEFT JOIN users u ON pp.completed_by_user_id = u.user_id
        WHERE p.patient_id = $1
        GROUP BY p.patient_id
      `

      const result = await db.query(query, [patientId])

      if (result.rows.length === 0) {
        return ResponseHandler.notFound(res, "Patient not found")
      }

      const patient = result.rows[0]
      patient.phases = patient.phases.filter((phase) => phase.phase_id !== null)

      return ResponseHandler.success(res, patient, "Patient retrieved successfully")
    } catch (error) {
      console.error("Get patient error:", error)
      return ResponseHandler.error(res, "Failed to retrieve patient")
    }
  }

  static async updatePatient(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { patientId } = req.params
      const updateData = req.body

      // Get current patient data for audit
      const currentResult = await client.query("SELECT * FROM patients WHERE patient_id = $1", [patientId])

      if (currentResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Patient not found")
      }

      const currentData = currentResult.rows[0]

      // Build update query
      const updateFields = Object.keys(updateData)
      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
      const values = [patientId, ...Object.values(updateData)]

      const updateQuery = `
        UPDATE patients 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE patient_id = $1
        RETURNING *
      `

      const result = await client.query(updateQuery, values)

      // Log patient update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "patients",
          patientId,
          "UPDATE",
          JSON.stringify(currentData),
          JSON.stringify(result.rows[0]),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Patient updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update patient error:", error)
      return ResponseHandler.error(res, "Failed to update patient")
    } finally {
      client.release()
    }
  }

  static async advancePatientPhase(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { patientId } = req.params
      const { next_phase_id } = req.body

      // Validate next phase
      if (![2, 3].includes(next_phase_id)) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "Invalid phase ID", 400)
      }

      // Check if patient exists
      const patientResult = await client.query("SELECT * FROM patients WHERE patient_id = $1", [patientId])
      if (patientResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Patient not found")
      }

      // Check if previous phase is completed
      const previousPhase = next_phase_id - 1
      const previousPhaseResult = await client.query(
        "SELECT * FROM patient_phases WHERE patient_id = $1 AND phase_id = $2 AND status = 'Completed'",
        [patientId, previousPhase]
      )

      if (previousPhaseResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, `Phase ${previousPhase} must be completed before advancing to Phase ${next_phase_id}`, 400)
      }

      // Check if next phase already exists
      const existingPhaseResult = await client.query(
        "SELECT * FROM patient_phases WHERE patient_id = $1 AND phase_id = $2",
        [patientId, next_phase_id]
      )

      if (existingPhaseResult.rows.length > 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, `Patient is already in Phase ${next_phase_id}`, 400)
      }

      // Create new phase entry
      const result = await client.query(
        "INSERT INTO patient_phases (patient_id, phase_id, phase_start_date, status) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *",
        [patientId, next_phase_id, "In Progress"]
      )

      // Log phase advancement
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["patient_phases", result.rows[0].patient_phase_id, "PHASE_ADVANCE", JSON.stringify(result.rows[0]), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], `Patient advanced to Phase ${next_phase_id} successfully`)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Advance patient phase error:", error)
      return ResponseHandler.error(res, "Failed to advance patient phase")
    } finally {
      client.release()
    }
  }

  static async getPatientsByPhase(req, res) {
    try {
      const { phaseId } = req.params
      const { page = 1, limit = 10, status = "In Progress" } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT p.*, pp.status as phase_status, pp.phase_start_date, pp.phase_end_date,
               ph.phase_name, u.username as completed_by
        FROM patients p
        INNER JOIN patient_phases pp ON p.patient_id = pp.patient_id
        LEFT JOIN phases ph ON pp.phase_id = ph.phase_id
        LEFT JOIN users u ON pp.completed_by_user_id = u.user_id
        WHERE pp.phase_id = $1
      `

      const params = [phaseId]

      if (status) {
        query += ` AND pp.status = $${params.length + 1}`
        params.push(status)
      }

      // Apply location-based filtering for non-admin users
      if (!req.user.roles.includes("admin")) {
        if (req.user.roles.includes("city_coordinator")) {
          const userCities = req.user.locations.filter((loc) => loc.city_id).map((loc) => loc.city_name)

          if (userCities.length > 0) {
            query += ` AND p.city_village = ANY($${params.length + 1})`
            params.push(userCities)
          }
        } else if (req.user.roles.includes("country_coordinator")) {
          const userCountries = req.user.locations.filter((loc) => loc.country_id).map((loc) => loc.country_name)

          if (userCountries.length > 0) {
            query += ` AND p.region_district = ANY($${params.length + 1})`
            params.push(userCountries)
          }
        }
      }

      query += ` ORDER BY pp.phase_start_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, `Patients in Phase ${phaseId} retrieved successfully`)
    } catch (error) {
      console.error("Get patients by phase error:", error)
      return ResponseHandler.error(res, "Failed to retrieve patients by phase")
    }
  }
}

module.exports = PatientController
