// const express = require("express")
// const cors = require("cors")

// const app = express()

// app.use(express.json())
// app.use(cors())

// app.use(require("./middleware/errorHandler"))

// const authRoutes = require("./router/auth.routes")
// const storeRoutes = require("./router/store.routes")
// const productRoutes = require("./router/products.routes")
// const stockInRoutes = require("./router/stockIn.routes")
// const saleRoutes = require("./router/sale.routes")
// const creditRoutes = require("./router/credit.routes")

// app.use("/api/products", productRoutes)
// app.use("/api/auth", authRoutes)
// app.use("/api/stores", storeRoutes)
// app.use("/api/stock", stockInRoutes)
// app.use("/api/sales", saleRoutes)
// app.use("/api/credits", creditRoutes)

// module.exports = app
const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const authRoutes = require("./router/auth.routes")
const storeRoutes = require("./router/store.routes")
const productRoutes = require("./router/products.routes")
const stockInRoutes = require("./router/stockIn.routes")
const saleRoutes = require("./router/sale.routes")
const creditRoutes = require("./router/credit.routes")

app.use("/api/auth", authRoutes)
app.use("/api/stores", storeRoutes)
app.use("/api/products", productRoutes)
app.use("/api/stock", stockInRoutes)
app.use("/api/sales", saleRoutes)
app.use("/api/credits", creditRoutes)

app.use(require("./middleware/errorHandler"))

module.exports = app
