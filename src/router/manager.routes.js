const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")
const managerController = require("../controller/manager.controller")

router.get("/profit", auth, checkRole.roleGuard("admin"), managerController.getProfit)

module.exports = router