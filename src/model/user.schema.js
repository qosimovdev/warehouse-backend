const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    name: { type: String, required: true },
    login: { type: String, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "seller", "warehouse"],
        default: "seller"
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    }
}, { timestamps: true })

const User = model("Users", userSchema)
module.exports = { User }