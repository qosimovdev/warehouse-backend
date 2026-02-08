const router = require("express").Router()
const storeController = require("../controller/store.controller")

router.post("/", storeController.createStore)
router.get("/", storeController.getStores)
router.get("/:id", storeController.getStoreById)
router.put("/:id", storeController.updateStore)
router.delete("/:id", storeController.deleteStore)

module.exports = router