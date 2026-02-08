const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const roleGuard = require("../middleware/role.middleware")
const productController = require("../controller/product.controller")

router.post("/", auth, roleGuard.roleGuard("admin"), productController.createProduct)
router.get("/", auth, productController.getProducts)
router.get("/:id", auth, productController.getProductById)
router.put("/:id", auth, roleGuard.roleGuard("admin"), productController.updateProduct)
router.delete("/:id", auth, roleGuard.roleGuard("admin"), productController.deleteProduct)
module.exports = router