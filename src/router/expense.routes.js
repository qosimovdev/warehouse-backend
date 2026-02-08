const router = require("express").Router()
const expenseController = require("../controller/expense.controller")
const auth = require("../middleware/auth.middleware")
const role = require("../middleware/role.middleware")

router.post("/", auth, role.roleGuard("admin"), expenseController.createExpense)
router.get("/", auth, role.roleGuard("admin"), expenseController.getExpenses)
router.get("/:id", auth, role.roleGuard("admin"), expenseController.deleteExpense)


module.exports = router