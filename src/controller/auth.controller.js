// const bcrypt = require("bcrypt")
// const { User } = require("../model/user.schema")
// const { signToken } = require("../utils/jwt")

// exports.register = async (req, res) => {
//     try {
//         const { name, login, password, role, storeId } = req.body
//         const existingUser = await User.findOne({ login })
//         if (existingUser) return res.status(409).json({ message: "User already exists" })
//         const hashedPassword = await bcrypt.hash(password, 10)
//         const newUser = new User({
//             name,
//             login,
//             password: hashedPassword,
//             role,
//             storeId
//         })
//         await newUser.save()
//         res.status(201).json({ message: "User registered successfully", newUser })
//     } catch (error) {
//         console.error("Registration error: ", error)
//         res.status(500).json({ message: "Server error" })
//     }
// }

// exports.login = async (req, res) => {
//     const { login, password } = req.body

//     const user = await User.findOne({ login })
//     if (!user) return res.status(404).json({ message: "User not found" })

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(401).json({ message: "Password or Login invalid" })

//     const token = signToken({
//         user_id: user._id,
//         store_id: user.store_id,
//         role: user.role
//     })

//     res.json({
//         token,
//         user: {
//             id: user._id,
//             fullName: user.fullName,
//             role: user.role,
//             store_id: user.store_id
//         }
//     })
// }

// exports.me = async (req, res) => {
//     const user = await User.findById(req.user.user_id).select("-password").populate("storeId")
//     res.json(user)
// }


const bcrypt = require("bcrypt")
const { User } = require("../model/user.schema")
const { signToken } = require("../utils/jwt")

// ================= REGISTER (ADMIN ONLY) =================
exports.createSeller = async (req, res) => {
    console.log("REQ.USER >>>", req.user)

    try {
        const { name, login, password } = req.body

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin only" })
        }

        const exists = await User.findOne({ login })
        if (exists) {
            return res.status(409).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const seller = await User.create({
            name,
            login,
            password: hashedPassword,
            role: "seller",
            storeId: req.user.store_id
        })

        res.status(201).json({
            message: "Seller yaratildi",
            user: {
                id: seller._id,
                name: seller.name,
                role: seller.role
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}


// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { login, password } = req.body

        const user = await User.findOne({ login })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Login or password invalid" })
        }

        const token = signToken({
            user_id: user._id,
            store_id: user.storeId,
            role: user.role
        })

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                store_id: user.storeId
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Server error" })
    }
}

// ================= ME =================
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id)
            .select("-password")
            .populate("storeId")

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}
