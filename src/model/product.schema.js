const { Schema, model } = require("mongoose")

const productSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["rebar", "angle", "pipe", "sheet"],
        required: true
    },
    // faqat rebar uchun
    diameterMm: {
        type: Number
    },
    // rebar bo‘lmasa
    spec: {
        type: String
    },
    stockMeters: {
        type: Number,
        default: 0,
        index: true
    },
    avgCostPerMeter: {
        type: Number,
        default: 0
    },
    minStockMeters: {
        type: Number,
        default: 500
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

productSchema.index(
    { storeId: 1, name: 1, isActive: 1 },
    { unique: true }
)
const Product = model("Product", productSchema)
module.exports = { Product }