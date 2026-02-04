const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

const authRoutes = require("./router/auth.routes")
const storeRoutes = require("./router/store.routes")
app.use("/api/auth", authRoutes)
app.use("/api/stores", storeRoutes)


module.exports = app