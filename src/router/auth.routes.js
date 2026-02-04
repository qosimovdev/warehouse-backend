const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")
const { createSeller, login, me } = require("../controller/auth.controller")

router.post("/seller", auth, roleGuard("admin"), createSeller)
router.post("/login", login)
router.get("/me", auth, me)


module.exports = router