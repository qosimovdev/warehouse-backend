const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")
const managerController = require("../controller/manager.controller")

router.get("/profit", auth, checkRole.roleGuard("admin"), managerController.getProfit)
router.get("/top-products", auth, checkRole.roleGuard("admin"), managerController.getTopProducts)
router.get("/sellers", auth, checkRole.roleGuard("admin"), managerController.getSellerStats)
router.get("/lose-sales", auth, checkRole.roleGuard("admin"), managerController.getLossSales)

module.exports = router