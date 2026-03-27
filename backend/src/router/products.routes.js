const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const checkRole = require("../middleware/role.middleware")
const productController = require("../controller/product.controller")

router.post("/", auth, checkRole.roleGuard("admin"), productController.createProduct)
router.get("/", auth, checkRole.roleGuard("admin", "seller"), productController.getProducts)
router.get("/:id", auth, checkRole.roleGuard("admin", "seller"), productController.getProductById)
router.put("/:id", auth, checkRole.roleGuard("admin"), productController.updateProduct)
router.delete("/:id", auth, checkRole.roleGuard("admin"), productController.deleteProduct)

module.exports = router