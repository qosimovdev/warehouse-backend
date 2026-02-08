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
    quantityM: {
        type: Number,
        required: true
    },
    pricePerM: {
        type: Number,
        required: true
    },
    totalPriceUzs: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ["cash", "bank", "credit"],
        required: true
    },
    customerame: String,
    customerPhone: String,
    dueDate: Date,
    isLoss: {
        type: Boolean,
        default: false
    },
    costPriceUzs: Number,
    profitUzs: Number,
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

saleSchema.index({ storeId: 1 })
saleSchema.index({ storeId: 1, createdAt: -1 })
saleSchema.index({ storeId: 1, sellerId: 1 })
saleSchema.index({ storeId: 1, productId: 1 })
saleSchema.index({ storeId: 1, profitUzs: 1 })
saleSchema.index({ storeId: 1, isLoss: 1 })



const Sale = model("Sale", saleSchema)
module.exports = { Sale }