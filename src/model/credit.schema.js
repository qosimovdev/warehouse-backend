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
    customer_name: {
        type: String,
        required: true
    },
    customer_phone: String,
    total_amount_uzs: {
        type: Number,
        required: true
    },
    paid_amount_uzs: {
        type: Number,
        default: 0
    },
    due_date: {
        type: Date,
        required: true
    },
    is_paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

creditSchema.index({ storeId: 1, createdAt: -1 });
creditSchema.index({ saleId: 1 });
creditSchema.index({ due_date: 1 });

const Credit = model("Credit", creditSchema)
module.exports = { Credit } 