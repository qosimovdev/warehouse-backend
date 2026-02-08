const { Schema, model } = require('mongoose');

const creditSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    saleId: {
        type: Schema.Types.ObjectId,
        ref: "Sale",
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: String,
    totalAmountUzs: {
        type: Number,
        required: true
    },
    paidAmountUzs: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

creditSchema.index({ storeId: 1, createdAt: -1 });
creditSchema.index({ saleId: 1 });
creditSchema.index({ dueDate: 1 });

const Credit = model("Credit", creditSchema)
module.exports = { Credit } 