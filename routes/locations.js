const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole } = require("../middleware/auth")
const LocationController = require("../controllers/locationController")

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Countries
router.get("/countries", LocationController.getCountries)
router.post(
  "/countries",
  requireRole(["admin"]),
  validateRequest(schemas.createCountry),
  LocationController.createCountry,
)
router.put("/countries/:countryId", requireRole(["admin"]), LocationController.updateCountry)
router.delete("/countries/:countryId", requireRole(["admin"]), LocationController.deleteCountry)

// Cities
router.get("/cities", LocationController.getCities)
router.post("/cities", requireRole(["admin"]), validateRequest(schemas.createCity), LocationController.createCity)
router.put("/cities/:cityId", requireRole(["admin"]), LocationController.updateCity)
router.delete("/cities/:cityId", requireRole(["admin"]), LocationController.deleteCity)

// User Locations
router.get("/user-locations", requireRole(["admin"]), LocationController.getUserLocations)
router.post(
  "/user-locations",
  requireRole(["admin"]),
  validateRequest(schemas.assignUserLocation),
  LocationController.assignUserLocation,
)
router.delete("/user-locations/:userLocationId", requireRole(["admin"]), LocationController.removeUserLocation)

module.exports = router
