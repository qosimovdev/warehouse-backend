

function rebarKgPerM(diameterMm) {
    if (!Number.isFinite(diameterMm) || diameterMm <= 0) {
        throw new Error("Armatura diameterMm noto'g'ri.");
    }
    return (diameterMm * diameterMm) / 162;
}

exports.calculateMeters = ({
    productType = productType.toLowerCase(),
    diameterMm,
    pieces,
    piece_length_m,
    tons,
    kgPerM,
    metersPerTon
}) => {
    tons = Number(tons)
    kgPerM = kgPerM !== undefined ? Number(kgPerM) : undefined
    metersPerTon = metersPerTon !== undefined ? Number(metersPerTon) : undefined
    pieces = pieces !== undefined ? Number(pieces) : undefined
    piece_length_m = piece_length_m !== undefined ? Number(piece_length_m) : undefined
    diameterMm = diameterMm !== undefined ? Number(diameterMm) : undefined

    if (!productType) throw new Error("productType kiritilishi shart.");

    if (productType === "rebar") {
        if (Number.isFinite(pieces) && Number.isFinite(piece_length_m)) {
            if (pieces <= 0 || piece_length_m <= 0) {
                throw new Error("Armatura uchun dona soni va dona uzunligi musbat bo'lishi kerak.");
            }
            return pieces * piece_length_m;
        }

        if (Number.isFinite(tons)) {
            if (tons <= 0) throw new Error("Armatura uchun tonna musbat bo'lishi kerak.");

            const kgPerM = Number.isFinite(kgPerM) ? kgPerM : rebarKgPerM(diameterMm);
            if (!Number.isFinite(kgPerM) || kgPerM <= 0) {
                throw new Error("Armatura uchun kgPerM yoki diameterMm to'g'ri bo'lishi shart.");
            }
            return (tons * 1000) / kgPerM;
        }

        throw new Error("Armatura uchun: (dona + dona uzunligi) yoki (tons + diameterMm) kerak.");
    }

    if (!Number.isFinite(tons) || tons <= 0) {
        throw new Error("Non-rebar uchun tons kiritilishi shart (musbat).");
    }

    if (Number.isFinite(metersPerTon) && metersPerTon > 0) {
        return tons * metersPerTon;
    }

    if (Number.isFinite(kgPerM) && kgPerM > 0) {
        return (tons * 1000) / kgPerM;
    }

    throw new Error("Non-rebar uchun 1 metr og'irligi yoki 1 tonna necha metr kiritilishi shart.");
};

exports.calculateTotalCostUZS = ({
    tons,
    pricePerTon,
    currency,
    usdRate
}) => {
    if (!Number.isFinite(tons) || tons <= 0) throw new Error("tons kiritilishi shart (musbat).");
    if (!Number.isFinite(pricePerTon) || pricePerTon <= 0) {
        throw new Error("pricePerTon kiritilishi shart (musbat).");
    }
    if (!currency) throw new Error("currency kiritilishi shart (UZS yoki USD).");

    let total = tons * pricePerTon;

    if (currency === "USD") {
        if (!Number.isFinite(usdRate) || usdRate <= 0) {
            throw new Error("USD kursi (usdRate) kiritilishi shart (musbat).");
        }
        total *= usdRate;
    }

    return total;
};

exports.calculateWeightedAvg = ({
    oldMeters,
    oldAvg,
    newMeters,
    newCostPerMeter
}) => {
    const om = Number.isFinite(oldMeters) ? oldMeters : 0;
    const oa = Number.isFinite(oldAvg) ? oldAvg : 0;

    if (!Number.isFinite(newMeters) || newMeters <= 0) return oa;
    if (!Number.isFinite(newCostPerMeter) || newCostPerMeter <= 0) return oa;

    if (om === 0) return newCostPerMeter;

    return (
        (om * oa + newMeters * newCostPerMeter) /
        (om + newMeters)
    );
};

exports.round = (n, d = 2) => {
    if (!Number.isFinite(n)) return 0;
    const p = Math.pow(10, d);
    return Math.round(n * p) / p;
};