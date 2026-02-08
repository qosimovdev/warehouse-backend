

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
    pieceLengthM,
    tons,
    kgPerM,
    metersPerTon
}) => {
    tons = Number(tons)
    kgPerM = kgPerM !== undefined ? Number(kgPerM) : undefined
    metersPerTon = metersPerTon !== undefined ? Number(metersPerTon) : undefined
    pieces = pieces !== undefined ? Number(pieces) : undefined
    pieceLengthM = pieceLengthM !== undefined ? Number(pieceLengthM) : undefined
    diameterMm = diameterMm !== undefined ? Number(diameterMm) : undefined

    if (!productType) throw new Error("productType kiritilishi shart.");

    if (productType === "rebar") {
        if (Number.isFinite(pieces) && Number.isFinite(pieceLengthM)) {
            if (pieces <= 0 || pieceLengthM <= 0) {
                throw new Error("Armatura uchun dona soni va dona uzunligi musbat bo'lishi kerak.");
            }
            return pieces * pieceLengthM;
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
    old_meters,
    old_avg,
    new_meters,
    new_cost_per_meter
}) => {
    const om = Number.isFinite(old_meters) ? old_meters : 0;
    const oa = Number.isFinite(old_avg) ? old_avg : 0;

    if (!Number.isFinite(new_meters) || new_meters <= 0) return oa;
    if (!Number.isFinite(new_cost_per_meter) || new_cost_per_meter <= 0) return oa;

    if (om === 0) return new_cost_per_meter;

    return (
        (om * oa + new_meters * new_cost_per_meter) /
        (om + new_meters)
    );
};

exports.round = (n, d = 2) => {
    if (!Number.isFinite(n)) return 0;
    const p = Math.pow(10, d);
    return Math.round(n * p) / p;
};