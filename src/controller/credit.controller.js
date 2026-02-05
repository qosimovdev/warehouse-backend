const { Credit } = require("../model/credit.schema")
const mongoose = require("mongoose");

exports.getCredits = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {
            storeId: req.user.store_id,
            isPaid: false
        };

        const credits = await Credit.find(filter)
            .populate("saleId", "total_price_uzs createdAt")
            .sort({ due_date: 1 })
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Nasiya ro'yxati",
            count: credits.length,
            page,
            limit,
            credits
        });

    } catch (error) {
        console.error("Get credits error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};


exports.getDueCredits = async (req, res) => {
    try {
        const today = new Date();

        const credits = await Credit.find({
            storeId: req.user.store_id,
            isPaid: false,
            dueDate: { $lte: today }
        })
            .sort({ dueDate: 1 })
            .limit(10);

        res.json({
            message: "Muddati o'tgan nasiya ro'yxati",
            count: credits.length,
            credits
        });
    } catch (error) {
        console.error("Get due credits error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};


exports.payCredit = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const amount = Number(req.body.paid_amount_uzs);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "Noto'g'ri to'lov summasi" });
        }
        const credit = await Credit.findOne({
            _id: req.params.id,
            storeId: req.user.store_id,
            is_paid: false
        }).session(session);
        if (!credit) {
            return res.status(404).json({
                message: "Nasiya topilmadi yoki allaqachon yopilgan"
            });
        }
        credit.paid_amount_uzs += amount;
        if (credit.paid_amount_uzs >= credit.total_amount_uzs) {
            credit.paid_amount_uzs = credit.total_amount_uzs;
            credit.is_paid = true;
            credit.paidAt = new Date();
        }

        await credit.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Nasiya to'lovi qabul qilindi",
            credit
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Pay credit error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};
