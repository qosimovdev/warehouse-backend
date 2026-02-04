const { Product } = require("../model/product.schema")

exports.createProduct = async (req, res) => {
    try {
        const { name, type, diameter_mm, spec, min_stock_meters } = req.body

        if (type === "rebar" && !diameter_mm)
            return res.status(400).json({ message: "Diameter_mm is required for rebar type" })

        if (type !== "rebar" && !spec)
            return res.status(400).json({ message: "Spec is required for non-rebar types" })

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
    const { search = "" } = req.query

    const products = await Product.find({
        storeId: req.user.store_id,
        name: { $regex: search, $options: "i" }
    }).limit(20)

    res.json(products)
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
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