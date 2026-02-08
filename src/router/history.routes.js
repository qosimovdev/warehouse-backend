const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const roleCheck = require("../middleware/role.middleware")
const historyController = require("../controller/history.controller")

router.get("/stosck-in", auth, historyController.stockInHistory)
router.get("/credits", auth, historyController.creditsHistory)
router.get("/expenses", auth, historyController.expensesHistory)
router.get("/sales", auth, historyController.salesHistory)

module.exports = router