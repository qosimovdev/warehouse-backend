const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const dashboardController = require("../controller/dashboard.controller")
const checkRole = require("../middleware/role.middleware")

router.get("/summary", auth, checkRole.roleGuard("admin"), dashboardController.getSummary)
router.get("/recent-sales", auth, checkRole.roleGuard("admin", "seller"), dashboardController.getRecentSales)
router.get("/low-stock", auth, checkRole.roleGuard("admin", "seller"), dashboardController.getLowStock)
router.get("/due-credits", auth, checkRole.roleGuard("admin", "seller"), dashboardController.getDueCredits)
router.get("/stock-in-history", auth, checkRole.roleGuard("admin"), dashboardController.getStockInHistory)

module.exports = router