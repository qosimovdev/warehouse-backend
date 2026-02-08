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

        // 1️⃣ Sales aggregation
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

        // 2️⃣ Expenses aggregation
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
