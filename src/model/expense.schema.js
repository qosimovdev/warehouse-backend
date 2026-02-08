const { Schema, model } = require("mongoose")

const expenseSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amountUzs: {
        type: Number,
        required: true,
    },
    source: {
        type: String,
        enum: ["cash", "bank"],
        default: "cash",
        required: true
    },
    note: {
        type: String,
    }
}, { timestamps: true })

const Expense = model("Expense", expenseSchema)
module.exports = { Expense }