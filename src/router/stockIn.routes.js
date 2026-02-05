const router = require("express").Router()
const { createStockIn, getStockIns } = require("../controller/stockIn.controller")
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")

router.post("/", auth, roleGuard("admin"), createStockIn)
// router.get("/", auth, getStockIns)

module.exports = router