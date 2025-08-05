const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole, requireLocationAccess } = require("../middleware/auth")
const Phase3Controller = require("../controllers/phase3Controller")

const router = express.Router()

// All routes require authentication and location access
router.use(authenticateToken)
router.use(requireLocationAccess)

// Phase 3 Registration Section
router.post(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  validateRequest(schemas.phase3Registration),
  Phase3Controller.createRegistration,
)

router.get(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  Phase3Controller.getRegistrations,
)

// Ear Screening
router.post(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  validateRequest(schemas.earScreening),
  Phase3Controller.createEarScreening,
)

router.get(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase3Controller.getEarScreenings,
)

// Aftercare Assessment
router.post(
  "/aftercare-assessment",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist", "audiologist"]),
  validateRequest(schemas.aftercareAssessment),
  Phase3Controller.createAftercareAssessment,
)

router.get(
  "/aftercare-assessment",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist", "audiologist"]),
  Phase3Controller.getAftercareAssessments,
)

// Final QC Phase 3
router.post(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  validateRequest(schemas.finalQCP3),
  Phase3Controller.createFinalQC,
)

router.get(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  Phase3Controller.getFinalQCs,
)

// Get complete Phase 3 data for a patient
router.get(
  "/patient/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist", "audiologist"]),
  Phase3Controller.getPhase3Data,
)

// Update Phase 3 records
router.put(
  "/registration/:registrationId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  Phase3Controller.updateRegistration,
)

router.put(
  "/ear-screening/:screeningId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase3Controller.updateEarScreening,
)

router.put(
  "/aftercare-assessment/:assessmentId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist", "audiologist"]),
  Phase3Controller.updateAftercareAssessment,
)

router.put(
  "/final-qc/:qcId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase3_specialist"]),
  Phase3Controller.updateFinalQC,
)

module.exports = router
