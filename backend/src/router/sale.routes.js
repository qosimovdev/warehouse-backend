const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware")
const saleController = require("../controller/sale.controller");

router.post("/", auth, checkRole.roleGuard("admin", "seller"), saleController.createSale);
router.get("/", auth, checkRole.roleGuard("admin", "seller"), saleController.getSales);
router.get("/:id", auth, checkRole.roleGuard("admin", "seller"), saleController.getSaleById);

module.exports = router;