const router = require("express").Router();
const { getCredits, getDueCredits, payCredit } = require("../controller/credit.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, getCredits)
router.get("/due", auth, getDueCredits)
router.post("/:id/pay", auth, payCredit)

module.exports = router;