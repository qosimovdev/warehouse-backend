module.exports = (err, req, res, next) => {
    console.error(" ERROR:", err);

    const statusCode = err.statusCode || 500;
    const message =
        err.isOperational
            ? err.message
            : "Serverda kutilmagan xatolik";

    res.status(statusCode).json({
        success: false,
        error: message
    });
};
