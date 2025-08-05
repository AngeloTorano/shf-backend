const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole, requireLocationAccess } = require("../middleware/auth")
const Phase1Controller = require("../controllers/phase1Controller")

const router = express.Router()

// All routes require authentication and location access
router.use(authenticateToken)
router.use(requireLocationAccess)

// Phase 1 Registration Section
router.post(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  validateRequest(schemas.phase1Registration),
  Phase1Controller.createRegistration,
)

router.get(
  "/registration",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.getRegistrations,
)

// Ear Screening
router.post(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  validateRequest(schemas.earScreening),
  Phase1Controller.createEarScreening,
)

router.get(
  "/ear-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase1Controller.getEarScreenings,
)

// Hearing Screening
router.post(
  "/hearing-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  validateRequest(schemas.hearingScreening),
  Phase1Controller.createHearingScreening,
)

router.get(
  "/hearing-screening",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase1Controller.getHearingScreenings,
)

// Ear Impressions
router.post(
  "/ear-impressions",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  validateRequest(schemas.earImpression),
  Phase1Controller.createEarImpression,
)

router.get(
  "/ear-impressions",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.getEarImpressions,
)

// Final QC Phase 1
router.post(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  validateRequest(schemas.finalQCP1),
  Phase1Controller.createFinalQC,
)

router.get(
  "/final-qc",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.getFinalQCs,
)

// Get complete Phase 1 data for a patient
router.get(
  "/patient/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase1Controller.getPhase1Data,
)

// Update Phase 1 records
router.put(
  "/registration/:registrationId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.updateRegistration,
)

router.put(
  "/ear-screening/:screeningId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase1Controller.updateEarScreening,
)

router.put(
  "/hearing-screening/:screeningId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist", "audiologist"]),
  Phase1Controller.updateHearingScreening,
)

router.put(
  "/ear-impressions/:impressionId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.updateEarImpression,
)

router.put(
  "/final-qc/:qcId",
  requireRole(["admin", "city_coordinator", "country_coordinator", "phase1_specialist"]),
  Phase1Controller.updateFinalQC,
)

module.exports = router
