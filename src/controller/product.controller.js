const { Product } = require("../model/product.schema")

exports.createProduct = async (req, res) => {
    try {
        const { name, type, diameter_mm, spec, min_stock_meters } = req.body

        if (type === "rebar" && !diameter_mm)
            return res.status(400).json({ message: "Diameter_mm is required for rebar type" })

        if (type !== "rebar" && !spec)
            return res.status(400).json({ message: "Spec is required for non-rebar types" })

        const exists = await Product.findOne({
            storeId: req.user.store_id,
            name,
            isActive: true
        })
        if (exists)
            return res.status(409).json({ message: "Product already exists" })

        const product = await Product.create({
            storeId: req.user.store_id,
            name,
            type,
            diameter_mm,
            spec,
            min_stock_meters
        })
        res.status(201).json({ message: "Product created successfully", product })
    } catch (error) {
        console.error("Create product error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getProducts = async (req, res) => {
    try {
        const { search = "" } = req.query
        const products = await Product.find({
            isActive: true,
            storeId: req.user.store_id,
            name: { $regex: search, $options: "i" }
        }).limit(20)

        res.json({ message: "Products fetched successfully", count: products.length, products })
    } catch (error) {
        console.error("Get products error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            isActive: true,
            _id: req.params.id,
            storeId: req.user.store_id
        })
        if (!product) return res.status(404).json({ message: "Product not found" })
        res.json(product)
    } catch (error) {
        console.error("Get product by ID error: ", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, type, diameter_mm, spec, min_stock_meters } = req.body

        const product = await Product.findOne({
            _id: req.params.id,
            storeId: req.user.store_id,
            isActive: true
        })

        if (!product)
            return res.status(404).json({ message: "Product not found" })

        if (type === "rebar" && !diameter_mm)
            return res.status(400).json({ message: "diameter_mm required for rebar" })

        if (type !== "rebar" && !spec)
            return res.status(400).json({ message: "spec required for non-rebar" })

        product.name = name ?? product.name
        product.type = type ?? product.type
        product.diameter_mm = type === "rebar" ? diameter_mm : undefined
        product.spec = type !== "rebar" ? spec : undefined
        product.min_stock_meters = min_stock_meters ?? product.min_stock_meters

        await product.save()

        res.json({ message: "Product updated successfully", product })
    } catch (error) {
        console.error("Update product error:", error)
        res.status(500).json({ message: "Server error" })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            storeId: req.user.store_id
        })

        if (!product)
            return res.status(404).json({ message: "Product not found" })

        if (!product.isActive) {
            return res.status(400).json({ message: "Product already deleted" })
        }

        product.isActive = false
        await product.save()

        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        console.error("Delete product error:", error)
        res.status(500).json({ message: "Server error" })
    }
}
