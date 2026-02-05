const { Schema, model } = require("mongoose")

const stockInSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: "Products", required: true },
    total_meters: { type: Number, required: true },
    price_per_ton: { type: Number, required: true },
    cost_per_meter: { type: Number, required: true },
    total_cost_uzs: { type: Number, required: true },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
})