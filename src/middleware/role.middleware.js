exports.roleGuard = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Sizga bu amalni bajarish huquqi berilmagan" })
        }
        next()
    }
}
