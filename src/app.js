const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

app.use(require("./middleware/errorHandler"))

const authRoutes = require("./router/auth.routes")
const storeRoutes = require("./router/store.routes")
const productRoutes = require("./router/products.routes")
const stockInRoutes = require("./router/stockIn.routes")
const saleRoutes = require("./router/sale.routes")


app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/stores", storeRoutes)
app.use("/api/stock", stockInRoutes)
app.use("/api/sales", saleRoutes)


module.exports = app