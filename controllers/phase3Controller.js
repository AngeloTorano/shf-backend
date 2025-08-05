const db = require("../config/database")
const ResponseHandler = require("../utils/responseHandler")

class Phase3Controller {
  // Phase 3 Registration Section
  static async createRegistration(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const registrationData = req.body
      registrationData.completed_by_user_id = req.user.user_id

      const columns = Object.keys(registrationData).join(", ")
      const placeholders = Object.keys(registrationData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(registrationData)

      const query = `
        INSERT INTO phase3_registration_section (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        [
          "phase3_registration_section",
          result.rows[0].phase3_reg_id,
          "CREATE",
          JSON.stringify(registrationData),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 3 registration created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 3 registration error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 3 registration")
    } finally {
      client.release()
    }
  }

  // Ear Screening
  static async createEarScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const screeningData = req.body
      screeningData.completed_by_user_id = req.user.user_id
      screeningData.phase_id = 3

      const columns = Object.keys(screeningData).join(", ")
      const placeholders = Object.keys(screeningData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(screeningData)

      const query = `
        INSERT INTO ear_screening (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["ear_screening", result.rows[0].ear_screening_id, "CREATE", JSON.stringify(screeningData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Ear screening created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create ear screening error:", error)
      return ResponseHandler.error(res, "Failed to create ear screening")
    } finally {
      client.release()
    }
  }

  // Aftercare Assessment
  static async createAftercareAssessment(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const assessmentData = req.body
      assessmentData.completed_by_user_id = req.user.user_id
      assessmentData.phase_id = 3

      const columns = Object.keys(assessmentData).join(", ")
      const placeholders = Object.keys(assessmentData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(assessmentData)

      const query = `
        INSERT INTO aftercare_assessment (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        [
          "aftercare_assessment",
          result.rows[0].assessment_id,
          "CREATE",
          JSON.stringify(assessmentData),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Aftercare assessment created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create aftercare assessment error:", error)
      return ResponseHandler.error(res, "Failed to create aftercare assessment")
    } finally {
      client.release()
    }
  }

  // Final QC Phase 3
  static async createFinalQC(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const qcData = req.body
      qcData.completed_by_user_id = req.user.user_id

      const columns = Object.keys(qcData).join(", ")
      const placeholders = Object.keys(qcData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(qcData)

      const query = `
        INSERT INTO final_qc_p3 (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["final_qc_p3", result.rows[0].final_qc_id, "CREATE", JSON.stringify(qcData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 3 final QC created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 3 final QC error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 3 final QC")
    } finally {
      client.release()
    }
  }



  // Get all aftercare assessments

  static async getRegistrations(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT p3r.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM phase3_registration_section p3r
        LEFT JOIN patients p ON p3r.patient_id = p.patient_id
        LEFT JOIN users u ON p3r.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`p3r.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY p3r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Phase 3 registrations retrieved successfully")
    } catch (error) {
      console.error("Get Phase 3 registrations error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 3 registrations")
    }
  }

  static async getEarScreenings(req, res) {
    try {
      const { patient_id, phase_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT es.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by, ph.phase_name
        FROM ear_screening es
        LEFT JOIN patients p ON es.patient_id = p.patient_id
        LEFT JOIN users u ON es.completed_by_user_id = u.user_id
        LEFT JOIN phases ph ON es.phase_id = ph.phase_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`es.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (phase_id) {
        conditions.push(`es.phase_id = $${params.length + 1}`)
        params.push(phase_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY es.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Ear screenings retrieved successfully")
    } catch (error) {
      console.error("Get ear screenings error:", error)
      return ResponseHandler.error(res, "Failed to retrieve ear screenings")
    }
  }

  static async getAftercareAssessments(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT aa.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM aftercare_assessment aa
        LEFT JOIN patients p ON aa.patient_id = p.patient_id
        LEFT JOIN users u ON aa.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`aa.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY aa.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Aftercare assessments retrieved successfully")
    } catch (error) {
      console.error("Get aftercare assessments error:", error)
      return ResponseHandler.error(res, "Failed to retrieve aftercare assessments")
    }
  }

  static async getFinalQCs(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT fqc.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM final_qc_p3 fqc
        LEFT JOIN patients p ON fqc.patient_id = p.patient_id
        LEFT JOIN users u ON fqc.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`fqc.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY fqc.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Phase 3 final QCs retrieved successfully")
    } catch (error) {
      console.error("Get Phase 3 final QCs error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 3 final QCs")
    }
  }

  static async updateRegistration(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { registrationId } = req.params
      const registrationData = req.body

      // Get current data for audit log
      const currentRegistrationResult = await client.query(
        "SELECT * FROM phase3_registration_section WHERE phase3_reg_id = $1",
        [registrationId]
      )

      if (currentRegistrationResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Phase 3 registration not found")
      }

      const currentRegistration = currentRegistrationResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(registrationData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(registrationData)
      values.push(registrationId) // Add registrationId for WHERE clause

      const query = `
        UPDATE phase3_registration_section 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE phase3_reg_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedRegistration = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "phase3_registration_section",
          registrationId,
          "UPDATE",
          JSON.stringify(currentRegistration),
          JSON.stringify(updatedRegistration),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedRegistration, "Phase 3 registration updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update Phase 3 registration error:", error)
      return ResponseHandler.error(res, "Failed to update Phase 3 registration")
    } finally {
      client.release()
    }
  }

  static async updateEarScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { screeningId } = req.params
      const screeningData = req.body

      // Get current data for audit log
      const currentScreeningResult = await client.query(
        "SELECT * FROM ear_screening WHERE ear_screening_id = $1",
        [screeningId]
      )

      if (currentScreeningResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Ear screening not found")
      }

      const currentScreening = currentScreeningResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(screeningData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(screeningData)
      values.push(screeningId) // Add screeningId for WHERE clause

      const query = `
        UPDATE ear_screening 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE ear_screening_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedScreening = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "ear_screening",
          screeningId,
          "UPDATE",
          JSON.stringify(currentScreening),
          JSON.stringify(updatedScreening),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedScreening, "Ear screening updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update ear screening error:", error)
      return ResponseHandler.error(res, "Failed to update ear screening")
    } finally {
      client.release()
    }
  }

  static async updateAftercareAssessment(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { assessmentId } = req.params
      const updateData = req.body

      // Get current data for audit
      const currentResult = await client.query("SELECT * FROM aftercare_assessment WHERE assessment_id = $1", [
        assessmentId,
      ])

      if (currentResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Aftercare assessment not found")
      }

      const currentData = currentResult.rows[0]

      // Build update query
      const updateFields = Object.keys(updateData)
      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
      const values = [assessmentId, ...Object.values(updateData)]

      const updateQuery = `
        UPDATE aftercare_assessment 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE assessment_id = $1
        RETURNING *
      `

      const result = await client.query(updateQuery, values)

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "aftercare_assessment",
          assessmentId,
          "UPDATE",
          JSON.stringify(currentData),
          JSON.stringify(result.rows[0]),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Aftercare assessment updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update aftercare assessment error:", error)
      return ResponseHandler.error(res, "Failed to update aftercare assessment")
    } finally {
      client.release()
    }
  }
  
  static async updateFinalQC(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { qcId } = req.params
      const qcData = req.body

      // Get current data for audit log
      const currentQCResult = await client.query(
        "SELECT * FROM final_qc_p3 WHERE final_qc_id = $1",
        [qcId]
      )

      if (currentQCResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Final QC not found")
      }

      const currentQC = currentQCResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(qcData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(qcData)
      values.push(qcId) // Add qcId for WHERE clause

      const query = `
        UPDATE final_qc_p3 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE final_qc_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedQC = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "final_qc_p3",
          qcId,
          "UPDATE",
          JSON.stringify(currentQC),
          JSON.stringify(updatedQC),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedQC, "Final QC updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update Final QC error:", error)
      return ResponseHandler.error(res, "Failed to update Final QC")
    } finally {
      client.release()
    }
  }  
  
  
  // Get complete Phase 3 data for a patient
  static async getPhase3Data(req, res) {
    try {
      const { patientId } = req.params

      const queries = {
        registration: `
          SELECT * FROM phase3_registration_section 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,        
        earScreening: `
          SELECT * FROM ear_screening 
          WHERE patient_id = $1 AND phase_id = 3 ORDER BY created_at DESC
        `,
        aftercareAssessment: `
          SELECT * FROM aftercare_assessment 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        finalQC: `
          SELECT * FROM final_qc_p3 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,

      }

      const results = {}

      for (const [key, query] of Object.entries(queries)) {
        const result = await db.query(query, [patientId])
        results[key] = key === "earScreening" ? result.rows : result.rows[0] || null
      }

      return ResponseHandler.success(res, results, "Phase 3 data retrieved successfully")
    } catch (error) {
      console.error("Get Phase 3 data error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 3 data")
    }
  }
}

module.exports = Phase3Controller