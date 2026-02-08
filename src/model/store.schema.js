const { Schema, model } = require("mongoose")

const storeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String },
    balance: {
        cash: { type: Number, default: 0 },
        bank: { type: Number, default: 0 }
    }

}, { timestamps: true })

const Store = model("Store", storeSchema)
module.exports = { Store }