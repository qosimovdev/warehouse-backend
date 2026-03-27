const { Sale } = require("../model/sale.schema")
const { Credit } = require("../model/credit.schema")
const { Expense } = require("../model/expense.schema")
const { StockIn } = require("../model/stockIn.schema")

// sotuv
exports.salesHistory = async (req, res) => {
    const { from, to } = req.query
    const filter = {
        storeId: req.user.store_id
    }
    if (from && to) {
        filter.createdAt = {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    }
    const sales = await Sale.find(filter)
        .populate("productId", "name")
        .populate("sellerId", "name")
        .sort({ createdAt: -1 })
        .limit(10)

    res.json({
        message: "Sotuvlar tarixi",
        count: sales.length,
        sales
    })
}

// krim
exports.stockInHistory = async (req, res) => {
    const { from, to } = req.query
    const filter = { storeId: req.user.store_id }
    if (from && to) {
        filter.createdAt = {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    }
    const stockIn = await StockIn.find(filter)
        .sort({ createdAt: -1 })
    res.json({
        message: "Kirimlar tarixi",
        stockIn
    })
}

// harajatlar
exports.expensesHistory = async (req, res) => {
    const { from, to } = req.query
    const filter = { storeId: req.user.store_id }
    if (from && to) {
        filter.createdAt = {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    }
    const expenses = await Expense.find(filter)
        .sort({ createdAt: -1 })
    res.json({
        message: "Harajatlar tarixi",
        expenses
    })
}

// nasiya tarixi
exports.creditsHistory = async (req, res) => {
    const { from, to } = req.query
    const filter = { storeId: req.user.store_id }
    if (from && to) {
        filter.createdAt = {
            $gte: new Date(from),
            $lte: new Date(to)
        }
    }
    const credits = await Credit.find(filter)
        .sort({ createdAt: -1 })
    res.json({
        message: "Nasiya tarixi",
        credits
    })
}