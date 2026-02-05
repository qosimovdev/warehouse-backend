const mongoose = require("mongoose");
const { Sale } = require("../model/sale.schema");
const { Product } = require("../model/product.schema");
const { Credit } = require("../model/credit.schema");

exports.createSale = async (req, res) => {
    const {
        product_id,
        quantity_m,
        price_per_m,
        payment_type,
        customer_name,
        customer_phone,
        due_date
    } = req.body;

    if (payment_type === "credit" && (!customer_name || !due_date)) {
        return res.status(400).json({
            message: "Nasiya uchun mijoz va muddat kiritilishi shart"
        });
    }

    const qty = Number(quantity_m);
    const price = Number(price_per_m);

    if (!Number.isFinite(qty) || qty <= 0)
        return res.status(400).json({ message: "Noto'g'ri quantity" });

    if (!Number.isFinite(price) || price <= 0)
        return res.status(400).json({ message: "Noto'g'ri narx" });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Product.findOne({
            _id: product_id,
            storeId: req.user.store_id,
            isActive: true
        }).session(session);

        if (!product)
            return res.status(404).json({ message: "Mahsulot topilmadi" });

        if (product.stock_meters < qty)
            return res.status(400).json({ message: "Omborda yetarli metr yo'q" });

        const total_price_uzs = qty * price;
        const is_loss = price < product.avg_cost_per_meter;

        const sale = await Sale.create([{
            storeId: req.user.store_id,
            productId: product_id,
            quantity_m: qty,
            price_per_m: price,
            total_price_uzs,
            payment_type,
            customer_name,
            customer_phone,
            due_date,
            is_loss,
            sellerId: req.user.user_id
        }], { session });

        product.stock_meters -= qty;
        await product.save({ session });

        if (payment_type === "credit") {
            await Credit.create([{
                storeId: req.user.store_id,
                saleId: sale[0]._id,
                customer_name,
                customer_phone,
                total_amount_uzs: total_price_uzs,
                due_date
            }], { session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Sotuv muvaffaqiyatli amalga oshirildi",
            sale: sale[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Create sale error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};

exports.getSales = async (req, res) => {
    try {
        const { fromDate, toDate, productId, sellerId, page = 1, limit = 20 } = req.query;

        const filter = { storeId: req.user.store_id };

        if (productId) filter.productId = productId;
        if (sellerId) filter.sellerId = sellerId;

        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const sales = await Sale.find(filter)
            .populate("productId", "name stock_meters diameter_mm")
            .populate("sellerId", "username name login")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            count: sales.length,
            page: Number(page),
            limit: Number(limit),
            sales
        });

    } catch (error) {
        console.error("Get sales error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};

exports.getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Noto'g'ri sale ID" });
        }
        const sale = await Sale.findOne({
            _id: id,
            storeId: req.user.store_id
        })
            .populate("productId", "name stock_meters diameter_mm")
            .populate("sellerId", "username name login");

        if (!sale)
            return res.status(404).json({ message: "Sotuv topilmadi" });

        res.status(200).json(sale);
    } catch (error) {
        console.error("Get sale by ID error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};
