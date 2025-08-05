const db = require("../config/database")
const ResponseHandler = require("../utils/responseHandler")

class Phase1Controller {
  // Phase 1 Registration Section
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
        INSERT INTO phase1_registration_section (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        [
          "phase1_registration_section",
          result.rows[0].phase1_reg_id,
          "CREATE",
          JSON.stringify(registrationData),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 1 registration created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 1 registration error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 1 registration")
    } finally {
      client.release()
    }
  }

  static async getRegistrations(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT p1r.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM phase1_registration_section p1r
        LEFT JOIN patients p ON p1r.patient_id = p.patient_id
        LEFT JOIN users u ON p1r.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`p1r.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY p1r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Phase 1 registrations retrieved successfully")
    } catch (error) {
      console.error("Get Phase 1 registrations error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 1 registrations")
    }
  }

  // Ear Screening
  static async createEarScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const screeningData = req.body
      screeningData.completed_by_user_id = req.user.user_id
      screeningData.phase_id = screeningData.phase_id || 1

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

  // Hearing Screening
  static async createHearingScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const screeningData = req.body
      screeningData.completed_by_user_id = req.user.user_id
      screeningData.phase_id = screeningData.phase_id || 1

      const columns = Object.keys(screeningData).join(", ")
      const placeholders = Object.keys(screeningData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(screeningData)

      const query = `
        INSERT INTO hearing_screening (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        [
          "hearing_screening",
          result.rows[0].hearing_screen_id,
          "CREATE",
          JSON.stringify(screeningData),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Hearing screening created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create hearing screening error:", error)
      return ResponseHandler.error(res, "Failed to create hearing screening")
    } finally {
      client.release()
    }
  }

  // Ear Impressions
  static async createEarImpression(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const impressionData = req.body
      impressionData.completed_by_user_id = req.user.user_id
      impressionData.phase_id = impressionData.phase_id || 1

      const columns = Object.keys(impressionData).join(", ")
      const placeholders = Object.keys(impressionData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(impressionData)

      const query = `
        INSERT INTO ear_impressions (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["ear_impressions", result.rows[0].impression_id, "CREATE", JSON.stringify(impressionData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Ear impression created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create ear impression error:", error)
      return ResponseHandler.error(res, "Failed to create ear impression")
    } finally {
      client.release()
    }
  }

  // Final QC Phase 1
  static async createFinalQC(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const qcData = req.body
      qcData.completed_by_user_id = req.user.user_id
      qcData.phase_id = qcData.phase_id || 1

      const columns = Object.keys(qcData).join(", ")
      const placeholders = Object.keys(qcData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(qcData)

      const query = `
        INSERT INTO final_qc_p1 (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["final_qc_p1", result.rows[0].final_qc_id, "CREATE", JSON.stringify(qcData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 1 final QC created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 1 final QC error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 1 final QC")
    } finally {
      client.release()
    }
  }

  static async getHearingScreenings(req, res) {
    try {
      const { patient_id, phase_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT hs.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by, ph.phase_name
        FROM hearing_screening hs
        LEFT JOIN patients p ON hs.patient_id = p.patient_id
        LEFT JOIN users u ON hs.completed_by_user_id = u.user_id
        LEFT JOIN phases ph ON hs.phase_id = ph.phase_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`hs.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (phase_id) {
        conditions.push(`hs.phase_id = $${params.length + 1}`)
        params.push(phase_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY hs.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Hearing screenings retrieved successfully")
    } catch (error) {
      console.error("Get hearing screenings error:", error)
      return ResponseHandler.error(res, "Failed to retrieve hearing screenings")
    }
  }

  static async getEarImpressions(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT ei.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by, ph.phase_name
        FROM ear_impressions ei
        LEFT JOIN patients p ON ei.patient_id = p.patient_id
        LEFT JOIN users u ON ei.completed_by_user_id = u.user_id
        LEFT JOIN phases ph ON ei.phase_id = ph.phase_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`ei.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY ei.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Ear impressions retrieved successfully")
    } catch (error) {
      console.error("Get ear impressions error:", error)
      return ResponseHandler.error(res, "Failed to retrieve ear impressions")
    }
  }

  static async getFinalQCs(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT fqc.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by, ph.phase_name
        FROM final_qc_p1 fqc
        LEFT JOIN patients p ON fqc.patient_id = p.patient_id
        LEFT JOIN users u ON fqc.completed_by_user_id = u.user_id
        LEFT JOIN phases ph ON fqc.phase_id = ph.phase_id
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

      return ResponseHandler.success(res, result.rows, "Phase 1 final QCs retrieved successfully")
    } catch (error) {
      console.error("Get Phase 1 final QCs error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 1 final QCs")
    }
  }

  // Update methods
  static async updateRegistration(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { registrationId } = req.params
      const registrationData = req.body

      // Get current data for audit log
      const currentRegistrationResult = await client.query(
        "SELECT * FROM phase1_registration_section WHERE phase1_reg_id = $1",
        [registrationId]
      )

      if (currentRegistrationResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Phase 1 registration not found")
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
        UPDATE phase1_registration_section 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE phase1_reg_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedRegistration = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "phase1_registration_section",
          registrationId,
          "UPDATE",
          JSON.stringify(currentRegistration),
          JSON.stringify(updatedRegistration),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedRegistration, "Phase 1 registration updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update Phase 1 registration error:", error)
      return ResponseHandler.error(res, "Failed to update Phase 1 registration")
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

  static async updateHearingScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { screeningId } = req.params
      const screeningData = req.body

      // Get current data for audit log
      const currentScreeningResult = await client.query(
        "SELECT * FROM hearing_screening WHERE hearing_screen_id = $1",
        [screeningId]
      )

      if (currentScreeningResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Hearing screening not found")
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
        UPDATE hearing_screening 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE hearing_screen_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedScreening = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "hearing_screening",
          screeningId,
          "UPDATE",
          JSON.stringify(currentScreening),
          JSON.stringify(updatedScreening),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedScreening, "Hearing screening updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update hearing screening error:", error)
      return ResponseHandler.error(res, "Failed to update hearing screening")
    } finally {
      client.release()
    }
  }

  static async updateEarImpression(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { impressionId } = req.params
      const impressionData = req.body

      // Get current data for audit log
      const currentImpressionResult = await client.query(
        "SELECT * FROM ear_impressions WHERE impression_id = $1",
        [impressionId]
      )

      if (currentImpressionResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Ear impression not found")
      }

      const currentImpression = currentImpressionResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(impressionData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(impressionData)
      values.push(impressionId) // Add impressionId for WHERE clause

      const query = `
        UPDATE ear_impressions 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE impression_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedImpression = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "ear_impressions",
          impressionId,
          "UPDATE",
          JSON.stringify(currentImpression),
          JSON.stringify(updatedImpression),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedImpression, "Ear impression updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update ear impression error:", error)
      return ResponseHandler.error(res, "Failed to update ear impression")
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
        "SELECT * FROM final_qc_p1 WHERE final_qc_id = $1",
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
        UPDATE final_qc_p1 
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
          "final_qc_p1",
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
      console.error("Update final QC error:", error)
      return ResponseHandler.error(res, "Failed to update final QC")
    } finally {
      client.release()
    }
  }

  // Get complete Phase 1 data for a patient
  static async getPhase1Data(req, res) {
    try {
      const { patientId } = req.params

      const queries = {
        registration: `
          SELECT * FROM phase1_registration_section 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        earScreening: `
          SELECT * FROM ear_screening 
          WHERE patient_id = $1 AND phase_id = 1 ORDER BY created_at DESC
        `,
        hearingScreening: `
          SELECT * FROM hearing_screening 
          WHERE patient_id = $1 AND phase_id = 1 ORDER BY created_at DESC LIMIT 1
        `,
        earImpressions: `
          SELECT * FROM ear_impressions 
          WHERE patient_id = $1 ORDER BY created_at DESC
        `,
        finalQC: `
          SELECT * FROM final_qc_p1 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
      }

      const results = {}

      for (const [key, query] of Object.entries(queries)) {
        const result = await db.query(query, [patientId])
        results[key] = key === "earScreening" || key === "earImpressions" ? result.rows : result.rows[0] || null
      }

      return ResponseHandler.success(res, results, "Phase 1 data retrieved successfully")
    } catch (error) {
      console.error("Get Phase 1 data error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 1 data")
    }
  }
}

module.exports = Phase1Controller
