const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")
const authController = require("../controller/auth.controller")

router.post("/seller", auth, checkRole.roleGuard("admin"), authController.createSeller)
router.post("/login", authController.login)
router.get("/me", auth, authController.me)
router.get("/users", auth, checkRole.roleGuard("admin"), authController.getUsers)
router.get("/user/:id", auth, checkRole.roleGuard("admin"), authController.getUser)
router.delete("/user/:id", auth, checkRole.roleGuard("admin"), authController.deleteUser)

module.exports = router