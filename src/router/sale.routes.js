const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { roleGuard } = require("../middleware/role.middleware")
const { createSale, getSales, getSaleById } = require("../controller/sale.controller");

router.post("/", auth, createSale);
router.get("/", auth, getSales);
router.get("/:id", auth, getSaleById);

module.exports = router;