const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole, requireLocationAccess } = require("../middleware/auth")
const PatientController = require("../controllers/patientController")

const router = express.Router()

// All routes require authentication and location access
router.use(authenticateToken)
router.use(requireLocationAccess)

// Routes accessible by coordinators and admins
router.post(
  "/",
  requireRole(["admin", "city_coordinator", "country_coordinator"]),
  validateRequest(schemas.createPatient),
  PatientController.createPatient,
)

router.get("/", requireRole(["admin", "city_coordinator", "country_coordinator"]), PatientController.getPatients)

router.get(
  "/phase/:phaseId",
  requireRole(["admin", "city_coordinator", "country_coordinator"]),
  PatientController.getPatientsByPhase,
)

router.get(
  "/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator"]),
  PatientController.getPatientById,
)

router.put(
  "/:patientId",
  requireRole(["admin", "city_coordinator", "country_coordinator"]),
  PatientController.updatePatient,
)

router.post(
  "/:patientId/advance-phase",
  requireRole(["admin", "city_coordinator", "country_coordinator"]),
  PatientController.advancePatientPhase,
)

module.exports = router
