const router = require("express").Router()
const stockInController = require("../controller/stockIn.controller")
const validate = require("../middleware/validate")
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")

router.post(
    "/",
    auth,
    roleGuard("admin"),
    // validate(calculationValidation.calculateSchemaValidation),
    stockInController.createStockIn
)
router.get("/", auth, stockInController.getStockIns)
router.get("/:id", auth, stockInController.getStockInById)
// router.post("/:id/cancel", auth, stockInController.cancelStockIn);

module.exports = router