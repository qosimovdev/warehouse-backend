const mongoose = require('mongoose');
const { Product } = require('../model/product.schema');
const { StockIn } = require('../model/stockIn.schema');
const stockCalculations = require('../utils/stockCalculations');
const AppError = require("../utils/appError");

exports.createStockIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            productId,
            tons,
            pricePerTon,
            currency,
            usdRate,
            kgPerM,
            metersPerTon,
            pieces,
            pieceLengthM
        } = req.body;
        if (currency === "USD" && !usdRate) {
            throw new AppError("USD valyuta uchun usdRate kiritilishi shart");
        }
        // ===== PRODUCT =====
        const product = await Product.findOne({
            _id: productId,
            storeId: req.user.store_id
        }).session(session);

        if (!product) {
            throw new AppError("Mahsulot topilmadi", 404);
        }

        // ===== METERS =====
        const metersRaw = stockCalculations.calculateMeters({
            productType: product.type,
            diameterMm: product.diameterMm,
            tons,
            kgPerM,
            metersPerTon,
            pieces,
            pieceLengthM
        });



        if (!Number.isFinite(metersRaw) || metersRaw <= 0) {
            throw new AppError(
                "Metr noto'g'ri hisoblandi. Ma'lumotlar yetarli emas",
                422
            );
        }

        const meters = stockCalculations.round(metersRaw);

        // ===== TOTAL COST =====
        const totalCostUZS = stockCalculations.calculateTotalCostUZS({
            tons,
            pricePerTon,
            currency,
            usdRate
        });

        if (!Number.isFinite(totalCostUZS) || totalCostUZS <= 0) {
            throw new AppError("Umumiy summa noto'g'ri hisoblandi", 422);
        }

        // ===== COST PER METER =====
        const costPerMeterRaw = totalCostUZS / meters;

        if (!Number.isFinite(costPerMeterRaw)) {
            throw new AppError("1 metr narxi noto'g'ri hisoblandi", 422);
        }

        const costPerMeter = stockCalculations.round(costPerMeterRaw);

        // ===== CREATE STOCK IN =====
        const [stockIn] = await StockIn.create(
            [
                {
                    storeId: product.storeId,
                    productId: product._id,
                    tons,
                    totalMeters: meters,
                    pricePerTon,
                    currency,
                    usdRateUsed: currency === "USD" ? usdRate : null,
                    totalCostUzs: totalCostUZS,
                    costPerMeter,
                    createdBy: req.user.user_id
                }
            ],
            { session }
        );

        // ===== UPDATE PRODUCT =====
        const oldMeters = product.stockMeters || 0;
        const oldAvg = product.avgCostPerMeter || 0;

        const newStockMeters = stockCalculations.round(oldMeters + meters);
        const newAvgCost = stockCalculations.round(
            stockCalculations.calculateWeightedAvg({
                oldMeters,
                oldAvg,
                newMeters: meters,
                newCostPerMeter: costPerMeter
            })
        );

        product.stockMeters = newStockMeters;
        product.avgCostPerMeter = newAvgCost;

        await product.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.json({
            success: true,
            message: "Kirim muvaffaqiyatli saqlandi",
            data: {
                stockIn,
                product
            }
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

// exports.createStockIn = async (req, res, next) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const {
//             productId,
//             tons,
//             pricePerTon,
//             currency,
//             usdRate,
//             kgPerM,
//             metersPerTon,
//             pieces,
//             pieceLengthM
//         } = req.body;

//         const product = await Product.findOne({
//             _id: new mongoose.Types.ObjectId(productId),
//             storeId: req.user.store_id
//         }).session(session);
//         if (!product) {
//             throw new Error("Mahsulot topilmadi");
//         }
//         const meters = stockCalculations.round(
//             stockCalculations.calculateMeters({
//                 productType: product.type,
//                 diameterMm: product.diameterMm,
//                 tons,
//                 kgPerM,
//                 metersPerTon,
//                 pieces,
//                 pieceLengthM
//             })
//         );
//         if (meters <= 0) {
//             throw new Error("Hisoblangan metr noto'g'ri");
//         }
//         // TODO: tons bo'lmagan holatlar uchun total cost logika
//         const totalCostUZS = stockCalculations.calculateTotalCostUZS({
//             tons,
//             pricePerTon,
//             currency,
//             usdRate
//         });
//         const costPerMeter = stockCalculations.round(totalCostUZS / meters);
//         if (!Number.isFinite(meters)) {
//             throw new Error("Hisoblangan metr noto'g'ri (ma'lumot yetarli emas)");
//         }

//         if (!Number.isFinite(totalCostUZS)) {
//             throw new Error("Umumiy summa noto'g'ri hisoblandi");
//         }

//         if (!Number.isFinite(costPerMeter)) {
//             throw new Error("1 metr narxi noto'g'ri hisoblandi");
//         }
//         const [stockIn] = await StockIn.create(
//             [
//                 {
//                     storeId: product.storeId,
//                     productId: product._id,
//                     tons,
//                     totalMeters: meters,
//                     pricePerTon,
//                     currency,
//                     usdRateUsed: currency === "USD" ? usdRate : null,
//                     totalCostUzs: totalCostUZS,
//                     costPerMeter: costPerMeter,
//                     createdBy: req.user.user_id
//                 }
//             ],
//             { session }
//         );
//         const oldMeters = product.stockMeters || 0;
//         const oldAvg = product.avgCostPerMeter || 0;
//         const newStockMeters = stockCalculations.round(oldMeters + meters);
//         const newAvgCost = stockCalculations.round(
//             stockCalculations.calculateWeightedAvg({
//                 oldMeters: oldMeters,
//                 oldAvg: oldAvg,
//                 newMeters: meters,
//                 newCostPerMeter: costPerMeter
//             })
//         );
//         product.stockMeters = newStockMeters;
//         product.avgCostPerMeter = newAvgCost;
//         await product.save({ session });
//         await session.commitTransaction();
//         session.endSession();
//         if (
//             Number.isFinite(product.minStockMeters) &&
//             product.stockMeters < product.minStockMeters
//         ) {
//             console.log(` ${product.name} kam qoldi`);
//         }
//         return res.json({
//             success: true,
//             message: "Kirim muvaffaqiyatli saqlandi",
//             data: {
//                 stockIn,
//                 product
//             }
//         });
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         next(err);
//     }
// };

exports.getStockIns = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        const filter = {
            storeId: req.user.store_id
        };

        // Sana bo'yicha filter
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                if (isNaN(Date.parse(fromDate))) {
                    return res.status(400).json({ message: "fromDate noto'g'ri formatda" });
                }
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                if (isNaN(Date.parse(toDate))) {
                    return res.status(400).json({ message: "toDate noto'g'ri formatda" });
                }
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }
        const stockIns = await StockIn.find(filter)
            .populate({
                path: "productId",
                select: "name type spec diameterMm"
            })
            .populate({
                path: "createdBy",
                select: "name login"
            })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Kirimlar olindi",
            count: stockIns.length,
            data: stockIns
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getStockInById = async (req, res) => {
    try {
        const stockIn = await StockIn.findOne({
            _id: req.params.id,
            storeId: req.user.store_id
        })
            .populate({
                path: 'productId',
                select: 'name type spec diameterMm'
            })
            .populate({
                path: 'createdBy',
                select: "name login"
            })
        if (!stockIn)
            return res.status(404).json({ message: "StockIn topilmadi" });
        res.json(stockIn);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};