const mongoose = require("mongoose");
const { Credit } = require("../model/credit.schema")
const updateBalance = require("../utils/updateBalance")

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
            .populate("saleId", "totalPriceUzs createdAt")
            .sort({ dueDate: 1 })
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
        const amount = Number(req.body.paidAmountUzs);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "Noto'g'ri to'lov summasi" });
        }

        const credit = await Credit.findOne({
            _id: req.params.id,
            storeId: req.user.store_id,
            isPaid: false
        }).session(session);

        if (!credit) {
            return res.status(404).json({
                message: "Nasiya topilmadi yoki allaqachon yopilgan"
            });
        }

        credit.paidAmountUzs = (credit.paidAmountUzs || 0) + amount;

        if (credit.paidAmountUzs >= credit.totalAmountUzs) {
            credit.paidAmountUzs = credit.totalAmountUzs;
            credit.isPaid = true;
            credit.paidAt = new Date();
        }

        await credit.save({ session });
        await session.commitTransaction();

        // balance ni yangilash
        await updateBalance({
            storeId,
            paymentType,
            amount: paidAmount,
            session
        });


        res.json({
            message: "Nasiya to'lovi qabul qilindi",
            credit
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Pay credit error:", error);
        res.status(500).json({ message: "Server xatosi" });
    } finally {
        session.endSession();
    }
};

