// const mongoose = require("mongoose")

// const connectDB = async () => {
//     if (!process.env.MONGO_URI) {
//         throw new Error("MONGO_URI is not defined")
//     }

//     await mongoose.connect(process.env.MONGO_URI)
// }

// module.exports = connectDB
const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined")
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        })

        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB