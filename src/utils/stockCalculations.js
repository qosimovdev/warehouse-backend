// // armatura uchun dona soni va uzunligi orqali metr hisoblash
// exports.calculateMeters = ({
//     productType,
//     pieces,
//     piece_length_m,
//     tons,
//     kg_per_m
// }) => {
//     // ARMATURA
//     if (productType === "rebar") {
//         if (!pieces || !piece_length_m)
//             throw new Error(
//                 "Armatura uchun dona soni va uzunligi kiritilishi shart."
//             )

//         return pieces * piece_length_m
//     }

//     // ARMATURA EMAS (LIST, TRUBA, va h.k.)
//     if (!kg_per_m)
//         throw new Error(
//             "Armatura bo'lmagan mahsulotlar uchun kg_per_m kiritilishi shart."
//         )

//     if (!tons)
//         throw new Error("Tonna kiritilishi shart.")

//     return (tons * 1000) / kg_per_m
// }

exports.calculateMeters = ({
    productType,
    pieces,
    piece_length_m,
    tons,
    kg_per_m
}) => {

    if (productType === "rebar") {
        if (!Number.isFinite(pieces) || !Number.isFinite(piece_length_m))
            throw new Error("Armatura uchun dona soni va uzunligi kiritilishi shart.");

        return pieces * piece_length_m;
    }

    // non-rebar
    if (!Number.isFinite(tons))
        throw new Error("tons kiritilishi shart.");

    if (!Number.isFinite(kg_per_m))
        throw new Error("kg_per_m kiritilishi shart.");

    return (tons * 1000) / kg_per_m;
};


// umumiy narxni hisoblash (UZSda)
exports.calculateTotalCostUZS = ({
    tons,
    price_per_ton,
    currency,
    usd_rate
}) => {
    let total = tons * price_per_ton;

    if (currency === 'USD') {
        if (!usd_rate)
            throw new Error("USD kursi kiritilishi shart.");
        total *= usd_rate
    }
    return total;
}

// og'irlikka asoslangan o'rtacha narxni hisoblash
exports.calculateWeightedAvg = ({
    old_meters,
    old_avg,
    new_meters,
    new_cost_per_meter
}) => {
    if (old_meters === 0) return new_cost_per_meter
    return (
        (old_meters * old_avg + new_meters * new_cost_per_meter) /
        (old_meters + new_meters)
    )
}

// taqriban chiqarish
exports.round = (n, d = 2) => {
    return Math.round(n * Math.pow(10, d)) / Math.pow(10, d)
}