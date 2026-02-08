const router = require("express").Router();
const creditController = require("../controller/credit.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, creditController.getCredits)
router.get("/due", auth, creditController.getDueCredits)
router.post("/:id/pay", auth, creditController.payCredit)

module.exports = router;