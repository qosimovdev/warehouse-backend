const mongoose = require("mongoose");
const { Expense } = require("../model/expense.schema");
const { Store } = require("../model/store.schema");
const updateBalance = require("../utils/updateBalance");

exports.createExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { category, amountUzs, source, note } = req.body;
        if (!category || !amountUzs || amountUzs <= 0) {
            return res.status(400).json({
                message: "Ma'lumotlar noto'g'ri"
            });
        }
        if (!["cash", "bank"].includes(source)) {
            return res.status(400).json({
                message: "To'lov manbasi noto'g'ri"
            });
        }
        const store = await Store.findById(req.user.store_id).session(session);
        if (!store) {
            return res.status(404).json({ message: "Do'kon topilmadi" });
        }
        if (store.balance[source] < amountUzs) {
            return res.status(400).json({
                message: "Balansda yetarli mablag' yo'q"
            });
        }
        const [expense] = await Expense.create([{
            storeId: req.user.store_id,
            category,
            amountUzs,
            source,
            note
        }], { session });

        // balance ni yangilash
        await updateBalance({
            storeId: req.user.store_id,
            paymentType: source,
            amount: -amountUzs,
            session
        });
        await session.commitTransaction();
        res.status(201).json({
            message: "Harajat qo'shildi",
            expense
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Create expense error:", error);
        res.status(500).json({ message: "Server xatosi" });
    } finally {
        session.endSession();
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const {
            fromDate,
            toDate,
            source,
            category,
            page = 1,
            limit = 20
        } = req.query;
        const filter = {
            storeId: req.user.store_id
        };
        if (source && ["cash", "bank"].includes(source)) {
            filter.source = source;
        }
        if (category) {
            filter.category = category;
        }
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) filter.createdAt.$gte = new Date(fromDate);
            if (toDate) filter.createdAt.$lte = new Date(toDate);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [expenses, total] = await Promise.all([
            Expense.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Expense.countDocuments(filter)
        ]);
        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            expenses
        });
    } catch (error) {
        console.error("Get expenses error:", error);
        res.status(500).json({ message: "Server xatosi" });
    }
};

exports.deleteExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            storeId: req.user.store_id
        }).session(session);
        if (!expense) {
            return res.status(404).json({ message: "Harajat topilmadi" });
        }

        // balansni qaytaramiz
        await updateBalance({
            storeId: expense.storeId,
            paymentType: expense.source,
            amount: expense.amountUzs,
            session
        });
        await expense.deleteOne({ session });
        await session.commitTransaction();
        res.json({ message: "Harajat o'chirildi" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Server xatosi" });
    } finally {
        session.endSession();
    }
};