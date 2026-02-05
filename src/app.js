const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

const authRoutes = require("./router/auth.routes")
const storeRoutes = require("./router/store.routes")
const productRoutes = require("./router/products.routes")
const stockInRoutes = require("./router/stockIn.routes")


app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/stores", storeRoutes)
app.use("/api/stock", stockInRoutes)


module.exports = app