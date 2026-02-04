const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE = '7d'

exports.signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}