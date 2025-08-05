const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole, requireLocationAccess } = require("../middleware/auth")
const Phase2Controller = require("../controllers/phase2Controller")

const router = express.Router()

// All routes require authentication and location access
router.use(authenticateToken)
router.use(requireLocationAccess)

// Phase 2 Registration Section
router.post(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  validateRequest(schemas.phase2Registration),
  Phase2Controller.createRegistration,
)

router.get(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.getRegistrations,
)

// Fitting Table
router.post(
  "/fitting-table",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  validateRequest(schemas.fittingTable),
  Phase2Controller.createFittingTable,
)

router.get(
  "/fitting-table",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.getFittingTables,
)

// Fitting
router.post(
  "/fitting",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  validateRequest(schemas.fitting),
  Phase2Controller.createFitting,
)

router.get(
  "/fitting",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.getFittings,
)

// Counseling
router.post(
  "/counseling",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "counselor"]),
  validateRequest(schemas.counseling),
  Phase2Controller.createCounseling,
)

router.get(
  "/counseling",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "counselor"]),
  Phase2Controller.getCounselings,
)

// Final QC Phase 2
router.post(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  validateRequest(schemas.finalQCP2),
  Phase2Controller.createFinalQC,
)

router.get(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.getFinalQCs,
)

// Get complete Phase 2 data for a patient
router.get(
  "/patient/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist", "counselor"]),
  Phase2Controller.getPhase2Data,
)

// Update Phase 2 records
router.put(
  "/registration/:registrationId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.updateRegistration,
)

router.put(
  "/fitting-table/:fittingTableId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateFittingTable,
)

router.put(
  "/fitting/:fittingId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateFitting,
)

router.put(
  "/counseling/:counselingId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "counselor"]),
  Phase2Controller.updateCounseling,
)

router.put(
  "/final-qc/:qcId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.updateFinalQC,
)

module.exports = router
