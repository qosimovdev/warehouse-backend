// require("dotenv").config()
// const app = require("./src/app")
// const connectDB = require("./src/config/db")

// connectDB()
// const PORT = process.env.PORT || 8080

// app.listen(PORT, () => {
//     console.log(`Server running on port http://localhost:${PORT}`);
// })

// require("dotenv").config()
// const app = require("./src/app")
// const connectDB = require("./src/config/db")

// connectDB()

// const PORT = process.env.PORT || 7777
// app.listen(PORT, () => {
//     console.log(`Server running on port http://localhost:${PORT}`)
// })


require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectDB()
        console.log("Mongo DB is connected")

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Startup error:", err.message)
    }
}

startServer()
