const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")
const { register, login, me } = require("../controller/auth.controller")

router.post("/register", auth, roleGuard("admin"), register)
router.post("/login", login)
router.get("/me", auth, me)

module.exports = router