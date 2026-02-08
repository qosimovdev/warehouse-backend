const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { roleGuard } = require("../middleware/role.middleware")
const saleController = require("../controller/sale.controller");

router.post("/", auth, saleController.createSale);
router.get("/", auth, saleController.getSales);
router.get("/:id", auth, saleController.getSaleById);

module.exports = router;