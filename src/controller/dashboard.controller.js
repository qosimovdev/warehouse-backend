const { Product } = require("../model/product.schema")
const { Sale } = require("../model/sale.schema")
const { Credit } = require("../model/credit.schema")
const { Expense } = require("../model/expense.schema")
const { Store } = require("../model/store.schema")
const { StockIn } = require("../model/stockIn.schema")


exports.getSummary = async (req, res) => {
    const storeId = req.user.store_id
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

    res.json(sales)
}

// kam qolgan tovar
exports.getLowStock = async (req, res) => {
    const products = await Product.find({
        storeId: req.user.store_id,
        $expr: { $lte: ["$stockMeters", "$minStockMeters"] }
    }).limit(10)

    res.json(products)
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

    res.json(history)
}


// ============= history ===================
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

