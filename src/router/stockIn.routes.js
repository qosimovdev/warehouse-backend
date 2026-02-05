const router = require("express").Router()
const { createStockIn, getStockIns, getStockInById } = require("../controller/stockIn.controller")
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")

router.post("/", auth, roleGuard("admin"), createStockIn)
router.get("/", auth, getStockIns)
router.get("/:id", auth, getStockInById)
// router.post("/:id/cancel", auth, stockInController.cancelStockIn);

module.exports = router