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
    diameter_mm: {
        type: Number
    },
    // rebar bo‘lmasa
    spec: {
        type: String
    },
    stock_meters: {
        type: Number,
        default: 0
    },
    avg_cost_per_meter: {
        type: Number,
        default: 0
    },
    min_stock_meters: {
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