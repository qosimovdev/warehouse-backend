const router = require("express").Router();
const creditController = require("../controller/credit.controller");
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware")

router.get("/", auth, checkRole.roleGuard("admin", "seller"), creditController.getCredits)
router.get("/due", auth, checkRole.roleGuard("admin"), creditController.getDueCredits)
router.post("/:id/pay", auth, checkRole.roleGuard("admin", "seller"), creditController.payCredit)

module.exports = router;
