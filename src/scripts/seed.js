require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { User } = require("../model/user.schema")
const { Store } = require("../model/store.schema")

const MONGO_URI = process.env.MONGO_URI

async function seed() {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("✅ MongoDB ulanishi muvaffaqiyatli")

        // Store yaratish
        const storeName = 'Main Store'
        const storeLocation = 'Headquarters'
        let store = await Store.findOne({ name: storeName })
        if (!store) {
            const newStore = await Store.create({ name: storeName, location: storeLocation })
            console.log("🏪 Store yaratildi", newStore.name)
        } else {
            console.log("🏪 Store allaqachon mavjud")
        }

        // Admin yaratish
        const adminName = "ibrohim"
        const adminLogin = "admin"
        const adminPassword = "admin123"
        let admin = await User.findOne({ login: adminLogin })

        if (!admin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10)

            const newAdmin = await User.create({
                name: adminName,
                login: adminLogin,
                password: hashedPassword,
                role: "admin",
                storeId: store._id
            })

            console.log("👤 Admin yaratildi", newAdmin.name)
        } else {
            console.log("👤 Admin allaqachon mavjud")
        }

        process.exit(0)
    } catch (err) {
        console.error("❌ Seed error:", err)
        process.exit(1)
    }
}

seed()
