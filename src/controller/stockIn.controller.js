const mongoose = require('mongoose');
const { Product } = require('../model/product.schema');
const { StockIn } = require('../model/stockIn.schema');
const {
    calculateMeters,
    calculateTotalCostUZS,
    calculateWeightedAvg,
    round
} = require('../utils/stockCalculations');

exports.createStockIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            productId,
            tons,
            price_per_ton,
            currency,
            usd_rate,
            kg_per_m,
            pieces,
            piece_length_m
        } = req.body;

        const product = await Product.findById(productId).session(session);
        if (!product) throw new Error('Product topilmadi');

        //  metr hisoblash
        const meters = round(
            calculateMeters({
                productType: product.type,
                tons,
                kg_per_m,
                pieces,
                piece_length_m
            })
        );

        //  umumiy narx
        const totalCostUZS = calculateTotalCostUZS({
            tons,
            price_per_ton,
            currency,
            usd_rate
        });

        const costPerMeter = totalCostUZS / meters;

        //  STOCK IN yaratish
        const [stockIn] = await StockIn.create([{
            storeId: product.storeId,
            productId,
            tons,
            total_meters: meters,
            price_per_ton,
            currency,
            usd_rate_used: usd_rate,
            total_cost_uzs: totalCostUZS,
            createdBy: req.user.user_id
        }], { session });

        //  PRODUCT update
        const oldMeters = product.stock_meters;
        const oldAvg = product.avg_cost_per_meter;

        product.stock_meters = round(oldMeters + meters);
        product.avg_cost_per_meter = round(
            calculateWeightedAvg({
                old_meters: oldMeters,
                old_avg: oldAvg,
                new_meters: meters,
                new_cost_per_meter: costPerMeter
            })
        );

        await product.save({ session });

        //  commit
        await session.commitTransaction();
        session.endSession();

        //  stock limit alert
        if (product.stock_meters < product.min_stock_meters) {
            console.log(`⚠️ ${product.name} kam qoldi`);
        }

        res.json({
            message: 'Stock in yaratildi.',
            stockIn,
            product
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};


exports.getStockIns = async (req, res) => {
    try {
        const { productId, fromDate, toDate } = req.query;
        const filter = { storeId: req.user.store_id };
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }
        if (fromDate && isNaN(Date.parse(fromDate))) {
            return res.status(400).json({ message: "fromDate noto'g'ri formatda" });
        }
        if (toDate && isNaN(Date.parse(toDate))) {
            return res.status(400).json({ message: "toDate noto'g'ri formatda" });
        }

        const stockIns = await StockIn
            .find(filter)
            .populate({
                path: 'productId',
                select: 'name type spec diameter_mm'
            })
            .populate({
                path: 'createdBy',
                select: "name login"
            })
            .sort({ createdAt: -1 });

        res.json({ message: "StockIns olindi", count: stockIns.length, stockIns });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getStockInById = async (req, res) => {
    try {
        const stockIn = await StockIn.findOne({
            _id: req.params.id,
            storeId: req.user.store_id
        })
            .populate({
                path: 'productId',
                select: 'name type spec diameter_mm'
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


// const mongoose = require("mongoose");

// exports.cancelStockIn = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const stockIn = await StockIn
//       .findById(req.params.id)
//       .session(session);

//     if (!stockIn)
//       throw new Error("StockIn topilmadi");

//     if (stockIn.isCanceled)
//       throw new Error("Bu stockIn allaqachon bekor qilingan");

//     const product = await Product
//       .findById(stockIn.productId)
//       .session(session);

//     // productdan metrni AYIR
//     product.stock_meters -= stockIn.total_meters;

//     if (product.stock_meters < 0)
//       throw new Error("Stock manfiy bo'lib ketdi");

//     await product.save({ session });

//     //  cancel yozuv
//     await StockIn.create([{
//       storeId: stockIn.storeId,
//       productId: stockIn.productId,
//       tons: -stockIn.tons,
//       total_meters: -stockIn.total_meters,
//       currency: stockIn.currency,
//       price_per_ton: stockIn.price_per_ton,
//       total_cost_uzs: -stockIn.total_cost_uzs,
//       usd_rate_used: stockIn.usd_rate_used,
//       createdBy: req.user.id,
//       isCancelRecord: true,
//       canceledStockInId: stockIn._id
//     }], { session });

//     //  eski yozuvni belgilash
//     stockIn.isCanceled = true;
//     await stockIn.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ message: "StockIn bekor qilindi (reverse qilindi)" });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(400).json({ message: err.message });
//   }
// };
