const { Schema, model } = require('mongoose');

const saleSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity_m: {
        type: Number,
        required: true
    },
    price_per_m: {
        type: Number,
        required: true
    },
    total_price_uzs: {
        type: Number,
        required: true
    },
    payment_type: {
        type: String,
        enum: ["cash", "bank", "credit"],
        required: true
    },
    customer_name: String,
    customer_phone: String,
    due_date: Date,
    is_loss: {
        type: Boolean,
        default: false
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

saleSchema.index({ storeId: 1, createdAt: -1 });
saleSchema.index({ productId: 1 });
saleSchema.index({ due_date: 1 });


const Sale = model("Sale", saleSchema)
module.exports = { Sale }