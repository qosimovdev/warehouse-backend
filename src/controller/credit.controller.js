const mongoose = require("mongoose");
const { Credit } = require("../model/credit.schema")
const updateBalance = require("../utils/updateBalance")
exports.getCredits = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            isPaid = "false",
            fromDate,
            toDate,
            sortBy = "dueDate",
            sortOrder = "asc"
        } = req.query;

        page = Math.max(Number(page), 1);
        limit = Math.min(Number(limit), 100);
        const skip = (page - 1) * limit;

        const filter = {
            storeId: req.user.store_id
        };

        // paid / unpaid
        if (isPaid !== "all") {
            filter.isPaid = isPaid === "true";
        }

        // date filter
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }

        const sort = {
            [sortBy]: sortOrder === "desc" ? -1 : 1
        };

        const [credits, total] = await Promise.all([
            Credit.find(filter)
                .populate("saleId", "totalPriceUzs createdAt")
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Credit.countDocuments(filter)
        ]);

        res.json({
            message: "Nasiya ro'yxati",
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
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


// exports.payCredit = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const amount = Number(req.body.paidAmountUzs);
//         const paymentType = req.body.paymentType;

//         if (!Number.isFinite(amount) || amount <= 0) {
//             return res.status(400).json({ message: "Noto'g'ri to'lov summasi" });
//         }

//         if (!["cash", "bank"].includes(paymentType)) {
//             return res.status(400).json({ message: "To'lov turi noto'g'ri" });
//         }

//         const credit = await Credit.findOne({
//             _id: req.params.id,
//             storeId: req.user.store_id,
//             isPaid: false
//         }).session(session);

//         if (!credit) {
//             return res.status(404).json({
//                 message: "Nasiya topilmadi yoki yopilgan"
//             });
//         }

//         credit.paidAmountUzs = (credit.paidAmountUzs || 0) + amount;

//         if (credit.paidAmountUzs >= credit.totalAmountUzs) {
//             credit.paidAmountUzs = credit.totalAmountUzs;
//             credit.isPaid = true;
//             credit.paidAt = new Date();
//         }

//         await credit.save({ session });

//         await updateBalance({
//             storeId: req.user.store_id,
//             paymentType,
//             amount,
//             session
//         });

//         await session.commitTransaction();
//         return res.json({
//             message: "Nasiya to'lovi qabul qilindi",
//             credit
//         });

//     } catch (error) {
//         if (session.inTransaction()) {
//             await session.abortTransaction();
//         }
//         console.error("Pay credit error:", error);
//         res.status(500).json({ message: "Server xatosi" });
//     } finally {
//         session.endSession();
//     }
// };
exports.payCredit = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { paidAmountUzs, paymentType } = req.body;
        const amount = Number(paidAmountUzs);

        if (!["cash", "bank"].includes(paymentType)) {
            return res.status(400).json({
                message: "To'lov turi (cash yoki bank) kiritilishi shart"
            });
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "To'lov summasi noto'g'ri"
            });
        }

        const credit = await Credit.findOne({
            _id: req.params.id,
            storeId: req.user.store_id,
            isPaid: false
        }).session(session);

        if (!credit) {
            return res.status(404).json({
                message: "Faol nasiya topilmadi"
            });
        }

        const remaining = credit.totalAmountUzs - (credit.paidAmountUzs || 0);

        if (amount > remaining) {
            return res.status(400).json({
                message: `Ortiqcha to'lov. Qolgan summa: ${remaining}`
            });
        }

        credit.paidAmountUzs = (credit.paidAmountUzs || 0) + amount;

        if (credit.paidAmountUzs === credit.totalAmountUzs) {
            credit.isPaid = true;
            credit.paidAt = new Date();
        }

        await credit.save({ session });

        await updateBalance({
            storeId: req.user.store_id,
            paymentType,
            amount,
            session
        });

        await session.commitTransaction();

        res.json({
            message: "Nasiya to'lovi qabul qilindi",
            credit,
            remaining: credit.totalAmountUzs - credit.paidAmountUzs
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Pay credit error:", error);
        res.status(500).json({ message: "Server xatosi" });
    } finally {
        session.endSession();
    }
};
