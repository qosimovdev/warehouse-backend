const router = require("express").Router()
const auth = require("../middleware/auth.middleware")
const { roleGuard } = require("../middleware/role.middleware")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controller/product.controller")

router.post("/", auth, roleGuard("admin"), createProduct)
router.get("/", auth, getProducts)
router.get("/:id", auth, getProductById)
router.put("/:id", auth, roleGuard("admin"), updateProduct)
router.delete("/:id", auth, roleGuard("admin"), deleteProduct)
module.exports = router