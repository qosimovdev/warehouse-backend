const { Schema, model } = require("mongoose")

const stockInSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    tons: Number,
    total_meters: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["UZS", "USD"],
        required: true
    },
    usd_rate: Number,
    usd_rate_used: {
        type: Number,
        required: function () {
            return this.currency === 'USD';
        }
    },
    price_per_ton: {
        type: Number,
        required: true
    },
    total_cost_uzs: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // isCanceled: {
    //     type: Boolean,
    //     default: false
    // },
    // isCancelRecord: {
    //     type: Boolean,
    //     default: false
    // },
    // canceledStockInId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "StockIn"
    // }
}, { timestamps: true })

const StockIn = model("StockIn", stockInSchema)
module.exports = { StockIn }