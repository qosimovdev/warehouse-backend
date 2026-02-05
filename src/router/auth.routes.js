const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")
const { createSeller, login, me, getUsers, getUser, deleteUser } = require("../controller/auth.controller")

router.post("/seller", auth, roleGuard("admin"), createSeller)
router.post("/login", login)
router.get("/me", auth, me)
router.get("/users", auth, roleGuard("admin"), getUsers)
router.get("/user/:id", auth, roleGuard("admin"), getUser)
router.delete("/user/:id", auth, roleGuard("admin"), deleteUser)

module.exports = router