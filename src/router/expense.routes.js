const router = require("express").Router()
const expenseController = require("../controller/expense.controller")
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")

router.post("/", auth, checkRole.roleGuard("admin"), expenseController.createExpense)
router.get("/", auth, checkRole.roleGuard("admin"), expenseController.getExpenses)
router.delete("/:id", auth, checkRole.roleGuard("admin"), expenseController.deleteExpense)

module.exports = router