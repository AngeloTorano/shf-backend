const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole } = require("../middleware/auth")
const UserController = require("../controllers/userController")

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Admin only routes
router.post("/", requireRole(["admin"]), validateRequest(schemas.createUser), UserController.createUser)
router.get("/", requireRole(["admin"]), UserController.getUsers)
router.get("/roles", requireRole(["admin"]), UserController.getRoles)
router.get("/:userId", requireRole(["admin"]), UserController.getUserById)
router.put("/:userId", requireRole(["admin"]), UserController.updateUser)
router.put("/:userId/roles", requireRole(["admin"]), UserController.updateUserRoles)
router.delete("/:userId", requireRole(["admin"]), UserController.deactivateUser)

module.exports = router
