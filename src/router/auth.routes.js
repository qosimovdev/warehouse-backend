const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")
const authController = require("../controller/auth.controller")

router.post("/seller", auth, roleGuard("admin"), authController.createSeller)
router.post("/login", authController.login)
router.get("/me", auth, authController.me)
router.get("/users", auth, roleGuard("admin"), authController.getUsers)
router.get("/user/:id", auth, roleGuard("admin"), authController.getUser)
router.delete("/user/:id", auth, roleGuard("admin"), authController.deleteUser)

module.exports = router