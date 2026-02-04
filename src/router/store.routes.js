const router = require("express").Router()
const { createStore, getStoreById, getStores, updateStore, deleteStore } = require("../controller/store.controller")

router.post("/", createStore)
router.get("/", getStores)
router.get("/:id", getStoreById)
router.put("/:id", updateStore)
router.delete("/:id", deleteStore)

module.exports = router