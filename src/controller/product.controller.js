const { Product } = require("../model/product.schema")

exports.createProduct = async (req, res) => {
    try {
        const { name, type, diameter_mm, spec, min_stock_meters } = req.body

        if (type === "rebar" && !diameter_mm)
            return res.status(400).json({ message: "Armatura turi uchun diameter_mm talab qilinadi" })

        if (type !== "rebar" && !spec)
            return res.status(400).json({ message: "Rebar turiga kirmaydigan mahsulotlarda spec bo'lishi kerak" })

        const exists = await Product.findOne({
            storeId: req.user.store_id,
            name,
            isActive: true
        })
        if (exists)
            return res.status(409).json({ message: "Maxsulot allaqachon mavjud" })

        const product = await Product.create({
            storeId: req.user.store_id,
            name,
            type,
            diameter_mm,
            spec,
            min_stock_meters
        })
        res.status(201).json({ message: "Maxsulot muvaffaqiyatli yaratildi", product })
    } catch (error) {
        console.error("Create product error: ", error)
        res.status(500).json({ message: "Server xatosi" })
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

        res.json({ message: "Maxsulotlar muvaffaqiyatli olingan", count: products.length, products })
    } catch (error) {
        console.error("Get products error: ", error)
        res.status(500).json({ message: "Server xatosi" })
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            isActive: true,
            _id: req.params.id,
            storeId: req.user.store_id
        })
        if (!product) return res.status(404).json({ message: "Maxsulot topilmadi" })
        res.json(product)
    } catch (error) {
        console.error("Get product by ID error: ", error)
        res.status(500).json({ message: "Server xatosi" })
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
            return res.status(404).json({ message: "Maxsulot topilmadi" })

        if (type === "rebar" && !diameter_mm)
            return res.status(400).json({ message: "Armatura turi uchun diameter_mm talab qilinadi" })

        if (type !== "rebar" && !spec)
            return res.status(400).json({ message: "Rebar turiga kirmaydigan mahsulotlarda spec bo'lishi kerak" })

        product.name = name ?? product.name
        product.type = type ?? product.type
        product.diameter_mm = type === "rebar" ? diameter_mm : undefined
        product.spec = type !== "rebar" ? spec : undefined
        product.min_stock_meters = min_stock_meters ?? product.min_stock_meters

        await product.save()

        res.json({ message: "Maxsulot muvaffaqiyatli yangilandi", product })
    } catch (error) {
        console.error("Update product error:", error)
        res.status(500).json({ message: "Server xatosi" })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            storeId: req.user.store_id
        })

        if (!product)
            return res.status(404).json({ message: "Maxsulot topilmadi" })

        if (!product.isActive) {
            return res.status(400).json({ message: "Maxsulot allaqachon o'chirilgan" })
        }

        product.isActive = false
        await product.save()

        res.json({ message: "Maxsulot muvaffaqiyatli o'chirildi" })
    } catch (error) {
        console.error("Delete product error:", error)
        res.status(500).json({ message: "Server xatosi" })
    }
}
