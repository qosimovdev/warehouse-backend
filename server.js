require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

connectDB()
const PORT = process.env.PORT || 7777

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})