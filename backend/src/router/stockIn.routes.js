const router = require("express").Router();
const stockInController = require("../controller/stockIn.controller");
const validate = require("../middleware/validate");
const { createStockInSchema } = require("../validation/stockIn.validation");
const auth = require("../middleware/auth.middleware");
const { roleGuard } = require("../middleware/role.middleware");

router.post(
    "/",
    auth,
    roleGuard("admin"),
    validate(createStockInSchema),
    stockInController.createStockIn
);

router.get("/", auth, stockInController.getStockIns);

router.get("/:id", auth, stockInController.getStockInById);

module.exports = router;