const { Store } = require("../model/store.schema")

exports.createStore = async (req, res) => {
    try {
        const { name, location } = req.body
        const existingStore = await Store.findOne({ name })
        if (existingStore) return res.status(409).json({ message: "Store already exists" })
        const newStore = new Store({ name, location })
        await newStore.save()
        res.status(201).json({ message: "Store created successfully", store: newStore })
    } catch (error) {
        console.error("Create store error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getStores = async (req, res) => {
    try {
        const stores = await Store.find()
        res.json(stores)
    } catch (error) {
        console.error("Get stores error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        if (!store) return res.status(404).json({ message: "Store not found" })
        res.json(store)
    } catch (error) {
        console.error("Get store by ID error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.updateStore = async (req, res) => {
    try {
        const { name, location } = req.body
        const store = await Store.findById(req.params.id)
        if (!store) return res.status(404).json({ message: "Store not found" })
        store.name = name || store.name
        store.location = location || store.location
        await store.save()
        res.json({ message: "Store updated successfully", store })
    }
    catch (error) {
        console.error("Update store error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.deleteStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        if (!store) return res.status(404).json({ message: "Store not found" })
        await store.remove()
        res.json({ message: "Store deleted successfully" })
    } catch (error) {
        console.error("Delete store error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}