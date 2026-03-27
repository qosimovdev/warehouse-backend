const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")
const historyController = require("../controller/history.controller")

router.get("/stock-in", auth, checkRole.roleGuard("admin"), historyController.stockInHistory)
router.get("/credits", auth, checkRole.roleGuard("admin"), historyController.creditsHistory)
router.get("/expenses", auth, checkRole.roleGuard("admin"), historyController.expensesHistory)
router.get("/sales", auth, checkRole.roleGuard("admin", "seller"), historyController.salesHistory)

module.exports = router