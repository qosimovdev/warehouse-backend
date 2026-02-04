const { Schema, model } = require("mongoose")

const storeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String }
}, { timestamps: true })

const Store = model("Store", storeSchema)
module.exports = { Store }