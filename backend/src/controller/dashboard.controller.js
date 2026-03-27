const mongoose = require("mongoose");
const { Product } = require("../model/product.schema")
const { Sale } = require("../model/sale.schema")
const { Credit } = require("../model/credit.schema")
const { Expense } = require("../model/expense.schema")
const { Store } = require("../model/store.schema")
const { StockIn } = require("../model/stockIn.schema")

exports.getSummary = async (req, res) => {
    const storeId = new mongoose.Types.ObjectId(req.user.store_id);
    const store = await Store.findById(storeId)
    const totalSales = await Sale.aggregate([
        { $match: { storeId } },
        { $group: { _id: null, total: { $sum: "$totalPriceUzs" } } }
    ])
    const totalExpenses = await Expense.aggregate([
        { $match: { storeId } },
        { $group: { _id: null, total: { $sum: "$amountUzs" } } }
    ])
    const creditExpected = await Credit.aggregate([
        { $match: { storeId, isPaid: false } },
        { $group: { _id: null, total: { $sum: "$totalAmountUzs" } } }
    ])
    res.json({
        totalSales: totalSales[0]?.total || 0,
        cash: store.balance.cash,
        bank: store.balance.bank,
        credit: creditExpected[0]?.total || 0,
        expenses: totalExpenses[0]?.total || 0
    })
}

// kop sotilgan
exports.getRecentSales = async (req, res) => {
    const sales = await Sale.find({
        storeId: req.user.store_id
    })
        .sort({ createdAt: -1 })
        .limit(10)

    res.json({ count: sales.length, sales })
}

// kam qolgan tovar
exports.getLowStock = async (req, res) => {
    const products = await Product.find({
        storeId: req.user.store_id,
        $expr: { $lte: ["$stockMeters", "$minStockMeters"] }
    }).limit(10)
    res.json({ count: products.length, products })
}

// to'lov vaxti yaqinlashgan nasiya
exports.getDueCredits = async (req, res) => {
    const today = new Date()

    const credits = await Credit.find({
        storeId: req.user.store_id,
        isPaid: false,
        dueDate: { $lte: today }
    }).limit(10)

    res.json(credits)
}

// oxirgi kirim
exports.getStockInHistory = async (req, res) => {
    const history = await StockIn.find({
        storeId: req.user.store_id
    })
        .sort({ createdAt: -1 })
        .limit(10)

    res.json({ count: history.length, history })
}



