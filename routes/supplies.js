const express = require("express")
const { validateRequest, schemas } = require("../middleware/validation")
const { authenticateToken, requireRole } = require("../middleware/auth")
const SupplyController = require("../controllers/supplyController")

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Supply categories
router.get("/categories", requireRole(["admin", "supply_manager"]), SupplyController.getSupplyCategories)
router.post(
  "/categories",
  requireRole(["admin", "supply_manager"]),
  validateRequest(schemas.createSupplyCategory),
  SupplyController.createSupplyCategory,
)

// Transaction types
router.get("/transaction-types", requireRole(["admin", "supply_manager"]), SupplyController.getTransactionTypes)

// Supply management
router.post(
  "/",
  requireRole(["admin", "supply_manager"]),
  validateRequest(schemas.createSupply),
  SupplyController.createSupply,
)

router.get("/", requireRole(["admin", "supply_manager"]), SupplyController.getSupplies)

router.put(
  "/:supplyId/stock",
  requireRole(["admin", "supply_manager"]),
  validateRequest(schemas.updateStock),
  SupplyController.updateStock,
)

router.get("/:supplyId/transactions", requireRole(["admin", "supply_manager"]), SupplyController.getSupplyTransactions)

router.get("/:supplyId", requireRole(["admin", "supply_manager"]), SupplyController.getSupplyById)

router.put("/:supplyId", requireRole(["admin", "supply_manager"]), SupplyController.updateSupply)

router.delete("/:supplyId", requireRole(["admin", "supply_manager"]), SupplyController.deleteSupply)

module.exports = router
