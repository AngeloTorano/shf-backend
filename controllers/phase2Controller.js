const db = require("../config/database")
const ResponseHandler = require("../utils/responseHandler")

class Phase2Controller {
  // Phase 2 Registration Section
  static async createRegistration(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const registrationData = req.body
      registrationData.completed_by_user_id = req.user.user_id
      registrationData.phase_id = 2

      const columns = Object.keys(registrationData).join(", ")
      const placeholders = Object.keys(registrationData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(registrationData)

      const query = `
        INSERT INTO phase2_registration_section (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        [
          "phase2_registration_section",
          result.rows[0].phase2_reg_id,
          "CREATE",
          JSON.stringify(registrationData),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 2 registration created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 2 registration error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 2 registration")
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
      screeningData.phase_id = 2

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

  // Hearing Screening
  static async createHearingScreening(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const screeningData = req.body
      screeningData.completed_by_user_id = req.user.user_id
      screeningData.phase_id = 2

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

  // Fitting Table
  static async createFittingTable(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const fittingData = req.body
      fittingData.fitter_id = req.user.user_id
      fittingData.phase_id = 2

      const columns = Object.keys(fittingData).join(", ")
      const placeholders = Object.keys(fittingData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(fittingData)

      const query = `
        INSERT INTO fitting_table (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["fitting_table", result.rows[0].fitting_table_id, "CREATE", JSON.stringify(fittingData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Fitting table created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create fitting table error:", error)
      return ResponseHandler.error(res, "Failed to create fitting table")
    } finally {
      client.release()
    }
  }

  // Fitting
  static async createFitting(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const fittingData = req.body
      fittingData.fitter_id = req.user.user_id

      const columns = Object.keys(fittingData).join(", ")
      const placeholders = Object.keys(fittingData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(fittingData)

      const query = `
        INSERT INTO fitting (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["fitting", result.rows[0].fitting_id, "CREATE", JSON.stringify(fittingData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Fitting created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create fitting error:", error)
      return ResponseHandler.error(res, "Failed to create fitting")
    } finally {
      client.release()
    }
  }

  // Counseling
  static async createCounseling(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const counselingData = req.body
      counselingData.completed_by_user_id = req.user.user_id

      const columns = Object.keys(counselingData).join(", ")
      const placeholders = Object.keys(counselingData)
        .map((_, index) => `$${index + 1}`)
        .join(", ")
      const values = Object.values(counselingData)

      const query = `
        INSERT INTO counseling (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["counseling", result.rows[0].counseling_id, "CREATE", JSON.stringify(counselingData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Counseling created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create counseling error:", error)
      return ResponseHandler.error(res, "Failed to create counseling")
    } finally {
      client.release()
    }
  }

  // Final QC Phase 2
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
        INSERT INTO final_qc_p2 (${columns})
        VALUES (${placeholders})
        RETURNING *
      `

      const result = await client.query(query, values)

      // Log creation
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5)",
        ["final_qc_p2", result.rows[0].final_qc_id, "CREATE", JSON.stringify(qcData), req.user.user_id],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, result.rows[0], "Phase 2 final QC created successfully", 201)
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Create Phase 2 final QC error:", error)
      return ResponseHandler.error(res, "Failed to create Phase 2 final QC")
    } finally {
      client.release()
    }
  }



  // Get Methods
  static async getRegistrations(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT p2r.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM phase2_registration_section p2r
        LEFT JOIN patients p ON p2r.patient_id = p.patient_id
        LEFT JOIN users u ON p2r.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`p2r.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY p2r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Phase 2 registrations retrieved successfully")
    } catch (error) {
      console.error("Get Phase 2 registrations error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 2 registrations")
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

  static async getFittingTables(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT ft.*, p.first_name, p.last_name, p.shf_id, u.username as fitter_name
        FROM fitting_table ft
        LEFT JOIN patients p ON ft.patient_id = p.patient_id
        LEFT JOIN users u ON ft.fitter_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`ft.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY ft.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Fitting tables retrieved successfully")
    } catch (error) {
      console.error("Get fitting tables error:", error)
      return ResponseHandler.error(res, "Failed to retrieve fitting tables")
    }
  }

  static async getFittings(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT f.*, p.first_name, p.last_name, p.shf_id, u.username as fitter_name
        FROM fitting f
        LEFT JOIN patients p ON f.patient_id = p.patient_id
        LEFT JOIN users u ON f.fitter_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`f.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY f.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Fittings retrieved successfully")
    } catch (error) {
      console.error("Get fittings error:", error)
      return ResponseHandler.error(res, "Failed to retrieve fittings")
    }
  }

  static async getCounselings(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT c.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM counseling c
        LEFT JOIN patients p ON c.patient_id = p.patient_id
        LEFT JOIN users u ON c.completed_by_user_id = u.user_id
      `

      const conditions = []
      const params = []

      if (patient_id) {
        conditions.push(`c.patient_id = $${params.length + 1}`)
        params.push(patient_id)
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`
      }

      query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(limit, offset)

      const result = await db.query(query, params)

      return ResponseHandler.success(res, result.rows, "Counselings retrieved successfully")
    } catch (error) {
      console.error("Get counselings error:", error)
      return ResponseHandler.error(res, "Failed to retrieve counselings")
    }
  }

  static async getFinalQCs(req, res) {
    try {
      const { patient_id, page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      let query = `
        SELECT fqc.*, p.first_name, p.last_name, p.shf_id, u.username as completed_by
        FROM final_qc_p2 fqc
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

      return ResponseHandler.success(res, result.rows, "Phase 2 final QCs retrieved successfully")
    } catch (error) {
      console.error("Get Phase 2 final QCs error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 2 final QCs")
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
        "SELECT * FROM phase2_registration_section WHERE phase2_reg_id = $1",
        [registrationId]
      )

      if (currentRegistrationResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Phase 2 registration not found")
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
        UPDATE phase2_registration_section 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE phase2_reg_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedRegistration = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "phase2_registration_section",
          registrationId,
          "UPDATE",
          JSON.stringify(currentRegistration),
          JSON.stringify(updatedRegistration),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedRegistration, "Phase 2 registration updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update Phase 2 registration error:", error)
      return ResponseHandler.error(res, "Failed to update Phase 2 registration")
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

  static async updateFittingTable(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { fittingTableId } = req.params
      const fittingData = req.body

      // Get current data for audit log
      const currentFittingResult = await client.query(
        "SELECT * FROM fitting_table WHERE fitting_table_id = $1",
        [fittingTableId]
      )

      if (currentFittingResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Fitting table not found")
      }

      const currentFitting = currentFittingResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(fittingData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(fittingData)
      values.push(fittingTableId) // Add fittingTableId for WHERE clause

      const query = `
        UPDATE fitting_table 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE fitting_table_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedFitting = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "fitting_table",
          fittingTableId,
          "UPDATE",
          JSON.stringify(currentFitting),
          JSON.stringify(updatedFitting),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedFitting, "Fitting table updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update fitting table error:", error)
      return ResponseHandler.error(res, "Failed to update fitting table")
    } finally {
      client.release()
    }
  }

  static async updateFitting(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { fittingId } = req.params
      const fittingData = req.body

      // Get current data for audit log
      const currentFittingResult = await client.query(
        "SELECT * FROM fitting WHERE fitting_id = $1",
        [fittingId]
      )

      if (currentFittingResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Fitting not found")
      }

      const currentFitting = currentFittingResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(fittingData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(fittingData)
      values.push(fittingId) // Add fittingId for WHERE clause

      const query = `
        UPDATE fitting 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE fitting_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedFitting = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "fitting",
          fittingId,
          "UPDATE",
          JSON.stringify(currentFitting),
          JSON.stringify(updatedFitting),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedFitting, "Fitting updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update fitting error:", error)
      return ResponseHandler.error(res, "Failed to update fitting")
    } finally {
      client.release()
    }
  }

  static async updateCounseling(req, res) {
    const client = await db.getClient()

    try {
      await client.query("BEGIN")

      const { counselingId } = req.params
      const counselingData = req.body

      // Get current data for audit log
      const currentCounselingResult = await client.query(
        "SELECT * FROM counseling WHERE counseling_id = $1",
        [counselingId]
      )

      if (currentCounselingResult.rows.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.notFound(res, "Counseling not found")
      }

      const currentCounseling = currentCounselingResult.rows[0]

      // Build update query dynamically
      const columns = Object.keys(counselingData)
      if (columns.length === 0) {
        await client.query("ROLLBACK")
        return ResponseHandler.error(res, "No data provided for update", 400)
      }

      const setClause = columns.map((col, index) => `${col} = $${index + 1}`).join(", ")
      const values = Object.values(counselingData)
      values.push(counselingId) // Add counselingId for WHERE clause

      const query = `
        UPDATE counseling 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE counseling_id = $${values.length}
        RETURNING *
      `

      const result = await client.query(query, values)
      const updatedCounseling = result.rows[0]

      // Log update
      await client.query(
        "INSERT INTO audit_logs (table_name, record_id, action_type, old_data, new_data, changed_by_user_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          "counseling",
          counselingId,
          "UPDATE",
          JSON.stringify(currentCounseling),
          JSON.stringify(updatedCounseling),
          req.user.user_id,
        ],
      )

      await client.query("COMMIT")

      return ResponseHandler.success(res, updatedCounseling, "Counseling updated successfully")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Update counseling error:", error)
      return ResponseHandler.error(res, "Failed to update counseling")
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
        "SELECT * FROM final_qc_p2 WHERE final_qc_id = $1",
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
        UPDATE final_qc_p2 
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
          "final_qc_p2",
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


    // Get complete Phase 2 data for a patient
  static async getPhase2Data(req, res) {
    try {
      const { patientId } = req.params

      const queries = {
        registration: `
          SELECT * FROM phase2_registration_section 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        earScreening: `
          SELECT * FROM ear_screening 
          WHERE patient_id = $1 AND phase_id = 2 ORDER BY created_at DESC
        `,
        hearingScreening: `
          SELECT * FROM hearing_screening 
          WHERE patient_id = $1 AND phase_id = 2 ORDER BY created_at DESC LIMIT 1
        `,
        fittingTable: `
          SELECT * FROM fitting_table 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        fitting: `
          SELECT * FROM fitting 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        counseling: `
          SELECT * FROM counseling 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
        finalQC: `
          SELECT * FROM final_qc_p2 
          WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1
        `,
      }

      const results = {}

      for (const [key, query] of Object.entries(queries)) {
        const result = await db.query(query, [patientId])
        results[key] = key === "earScreening" ? result.rows : result.rows[0] || null
      }

      return ResponseHandler.success(res, results, "Phase 2 data retrieved successfully")
    } catch (error) {
      console.error("Get Phase 2 data error:", error)
      return ResponseHandler.error(res, "Failed to retrieve Phase 2 data")
    }
  }
}

module.exports = Phase2Controller
