// const mongoose = require("mongoose")

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI)
//         console.log("Mongo DB is connected");
//     } catch (err) {
//         console.error("Mongo DB connection faild: ", err.message);
//         process.exit(1)
//     }
// }
// module.exports = connectDB

const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        console.log("MONGO_URI >>>", process.env.MONGO_URI)

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB is connected")
    } catch (err) {
        console.error("Mongo DB connection faild:", err.message)
        process.exit(1)
    }
}

module.exports = connectDB
