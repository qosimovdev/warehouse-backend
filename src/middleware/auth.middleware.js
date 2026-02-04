const { verifyToken } = require("../utils/jwt")

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token required" })
        }

        const token = authHeader.split(" ")[1]

        const decoded = verifyToken(token)

        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}
