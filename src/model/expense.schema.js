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

expenseSchema.index({ storeId: 1 })
expenseSchema.index({ storeId: 1, createdAt: -1 })
expenseSchema.index({ storeId: 1, category: 1 })


const Expense = model("Expense", expenseSchema)
module.exports = { Expense }