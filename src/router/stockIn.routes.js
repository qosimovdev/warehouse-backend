const router = require("express").Router();
const stockInController = require("../controller/stockIn.controller");
const validate = require("../middleware/validate"); // middleware alohida fayl
const { createStockInSchema } = require("../validation/stockIn.validation");
const auth = require("../middleware/auth.middleware");
const { roleGuard } = require("../middleware/role.middleware");

// CREATE Stock In
router.post(
    "/",
    auth,
    roleGuard("admin"),
    validate(createStockInSchema), // <-- schema ni shunday uzatish kerak
    stockInController.createStockIn
);

// LIST all Stock Ins
router.get("/", auth, stockInController.getStockIns);

// GET by ID
router.get("/:id", auth, stockInController.getStockInById);

// CANCEL (agar kerak bo‘lsa)
// router.post("/:id/cancel", auth, stockInController.cancelStockIn);

module.exports = router;