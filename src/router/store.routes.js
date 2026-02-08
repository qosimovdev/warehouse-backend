const router = require("express").Router()
const storeController = require("../controller/store.controller")
const auth = require("../middleware/auth.middleware")
const guard = require("../middleware/role.middleware")

router.post("/", storeController.createStore)
router.get("/", auth, guard.roleGuard("admin"), storeController.getStores)
router.get("/:id", auth, guard.roleGuard("admin"), storeController.getStoreById)
// router.put("/:id", storeController.updateStore)
// router.delete("/:id", auth, storeController.deleteStore)

module.exports = router