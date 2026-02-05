const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { roleGuard } = require("../middleware/role.middleware")
const { createSale, getSales } = require("../controller/sale.controller");

router.post("/", auth, createSale);
router.get("/", auth, getSales);

module.exports = router;