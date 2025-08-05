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

router.put(
  "/registration/:registrationId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.updateRegistration,
)

// Ear Screening--
router.post(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  validateRequest(schemas.earScreening),
  Phase2Controller.createEarScreening,
)

router.get(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.getEarScreenings,
)

router.put(
  "/ear-screening/:screeningId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateEarScreening,
)

// Hearing Screening
router.post(
  "/hearing-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  validateRequest(schemas.hearingScreening),
  Phase2Controller.createHearingScreening,
)

router.get(
  "/hearing-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.getHearingScreenings,
)

router.put(
  "/hearing-screening/:screeningId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateHearingScreening,
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

router.put(
  "/fitting-table/:fittingTableId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateFittingTable,
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

router.put(
  "/fitting/:fittingId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist"]),
  Phase2Controller.updateFitting,
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

router.put(
  "/counseling/:counselingId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "counselor"]),
  Phase2Controller.updateCounseling,
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

router.put(
  "/final-qc/:qcId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist"]),
  Phase2Controller.updateFinalQC,
)

// Get complete Phase 2 data for a patient
router.get(
  "/patient/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase2_specialist", "audiologist", "counselor"]),
  Phase2Controller.getPhase2Data,
)

module.exports = router
