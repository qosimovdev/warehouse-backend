// const { Product } = require("../model/product.schema")
// const { StockIn } = require("../model/stockIn.schema")
// const { calculateMeters, calculateTotalCostUZS, calculateWeightedAvg, round } = require("../utils/stockCalculations")

// exports.createStockIn = async (req, res) => {
//     try {


//         const {
//             productId,
//             tons,
//             currency,
//             usd_rate,
//             price_per_ton,
//             pieces,
//             piece_length_m,
//             kg_per_m
//         } = req.body

//         const product = await Product.findOne({
//             _id: productId,
//             storeId: req.user.store_id
//         })

//         if (!product) {
//             return res.status(404).json({ message: "Mahsulot topilmadi." })
//         }

//         // Metrlarni hisoblash
//         const total_meters = round(calculateMeters({
//             productType: product.type,
//             pieces,
//             piece_length_m,
//             tons,
//             kg_per_m
//         }))

//         // Umumiy narxni hisoblash (UZSda)
//         const total_cost_uzs = round(calculateTotalCostUZS({
//             tons,
//             price_per_ton,
//             currency,
//             usd_rate
//         }))

//         const cost_per_meter = round(total_cost_uzs / total_meters)

//         // og'irlikka asoslangan o'rtacha narxni hisoblash
//         const new_avg = round(calculateWeightedAvg({
//             old_meters: product.stock_meters,
//             old_avg: product.avg_cost_per_meter,
//             new_meters: total_meters,
//             new_cost_per_meter: cost_per_meter
//         }))

//         // product yangilash
//         product.stock_meters = round(product.stock_meters + total_meters, 3)
//         product.avg_cost_per_meter = round(new_avg, 2)
//         await product.save()

//         // stockIn yaratish
//         const stockIn = await StockIn.create({
//             storeId: req.user.store_id,
//             productId,
//             tons,
//             total_meters,
//             currency,
//             usd_rate,
//             price_per_ton,
//             total_cost_uzs,
//             createdBy: req.user.user_id
//         })
//         return res.status(201).json({
//             message: "Stock in yaratildi.",
//             stockIn,
//             product
//         })
//     } catch (error) {
//         console.error("Stock in yaratishda xatolik:", error)
//         return res.status(500).json({
//             message: "Serverda xatolik yuz berdi."
//         })
//     }
// }


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
