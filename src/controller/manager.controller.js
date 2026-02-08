const mongoose = require("mongoose");
const { Sale } = require("../model/sale.schema");
const { Expense } = require("../model/expense.schema");

exports.getProfit = async (req, res) => {
    try {
        const storeId = new mongoose.Types.ObjectId(req.user.store_id);
        const { from, to } = req.query;
        const match = { storeId };
        if (from || to) {
            match.createdAt = {};
            if (from) match.createdAt.$gte = new Date(from);
            if (to) match.createdAt.$lte = new Date(to);
        }
        const salesAgg = await Sale.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalPriceUzs" },
                    cost: { $sum: "$costPriceUzs" },
                    profit: { $sum: "$profitUzs" }
                }
            }
        ]);
        const revenue = salesAgg[0]?.revenue || 0;
        const cost = salesAgg[0]?.cost || 0;
        const grossProfit = salesAgg[0]?.profit || 0;

        const expenseAgg = await Expense.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amountUzs" }
                }
            }
        ]);

        const expenses = expenseAgg[0]?.total || 0;
        res.json({
            revenue,
            cost,
            grossProfit,
            expenses,
            netProfit: grossProfit - expenses
        });
    } catch (error) {
        console.error("Get profit error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};

exports.getTopProducts = async (req, res) => {
    try {
        const storeId = new mongoose.Types.ObjectId(req.user.store_id);
        const { from, to } = req.query;
        const match = { storeId };
        if (from || to) {
            match.createdAt = {};
            if (from) match.createdAt.$gte = new Date(from);
            if (to) match.createdAt.$lte = new Date(to);
        }
        const top = await Sale.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$productId",
                    totalMeters: { $sum: "$quantityM" },
                    totalProfit: { $sum: "$profitUzs" },
                    totalRevenue: { $sum: "$totalPriceUzs" }
                }
            },
            { $sort: { totalProfit: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    name: "$product.name",
                    totalMeters: 1,
                    totalRevenue: 1,
                    totalProfit: 1
                }
            }
        ]);
        res.json({
            total: top.length,
            products: top
        });
    } catch (error) {
        console.error("Get top products error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};

exports.getSellerStats = async (req, res) => {
    const storeId = req.user.store_id
    const stats = await Sale.aggregate([
        { $match: { storeId } },
        {
            $group: {
                _id: "$sellerId",
                salesCount: { $sum: 1 },
                totalRevenue: { $sum: "$totalPriceUzs" },
                totalProfit: { $sum: "$profitUzs" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "seller"
            }
        },
        { $unwind: "$seller" }
    ])
    res.json(stats)
}

exports.getLossSales = async (req, res) => {
    try {
        const storeId = req.user.store_id;
        const { page = 1, limit = 20, from, to } = req.query;
        const skip = (page - 1) * limit;
        const filter = {
            storeId,
            profitUzs: { $lt: 0 }
        };
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }
        const [sales, total] = await Promise.all([
            Sale.find(filter)
                .populate("productId", "name")
                .populate("sellerId", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),

            Sale.countDocuments(filter)
        ]);
        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit),
            lossSales: sales
        });
    } catch (error) {
        console.error("Get loss sales error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};