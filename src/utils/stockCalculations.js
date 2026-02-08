

function rebarKgPerM(diameter_mm) {
    if (!Number.isFinite(diameter_mm) || diameter_mm <= 0) {
        throw new Error("Armatura diameter_mm noto'g'ri.");
    }
    return (diameter_mm * diameter_mm) / 162;
}

exports.calculateMeters = ({
    productType = productType.toLowerCase(),
    diameter_mm,
    pieces,
    piece_length_m,
    tons,
    kg_per_m,
    meters_per_ton
}) => {
    tons = Number(tons)
    kg_per_m = kg_per_m !== undefined ? Number(kg_per_m) : undefined
    meters_per_ton = meters_per_ton !== undefined ? Number(meters_per_ton) : undefined
    pieces = pieces !== undefined ? Number(pieces) : undefined
    piece_length_m = piece_length_m !== undefined ? Number(piece_length_m) : undefined
    diameter_mm = diameter_mm !== undefined ? Number(diameter_mm) : undefined

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

            const kgPerM = Number.isFinite(kg_per_m) ? kg_per_m : rebarKgPerM(diameter_mm);
            if (!Number.isFinite(kgPerM) || kgPerM <= 0) {
                throw new Error("Armatura uchun kg_per_m yoki diameter_mm to'g'ri bo'lishi shart.");
            }
            return (tons * 1000) / kgPerM;
        }

        throw new Error("Armatura uchun: (dona + dona uzunligi) yoki (tons + diameter_mm) kerak.");
    }

    if (!Number.isFinite(tons) || tons <= 0) {
        throw new Error("Non-rebar uchun tons kiritilishi shart (musbat).");
    }

    if (Number.isFinite(meters_per_ton) && meters_per_ton > 0) {
        return tons * meters_per_ton;
    }

    if (Number.isFinite(kg_per_m) && kg_per_m > 0) {
        return (tons * 1000) / kg_per_m;
    }

    throw new Error("Non-rebar uchun 1 metr og'irligi yoki 1 tonna necha metr kiritilishi shart.");
};

exports.calculateTotalCostUZS = ({
    tons,
    price_per_ton,
    currency,
    usd_rate
}) => {
    if (!Number.isFinite(tons) || tons <= 0) throw new Error("tons kiritilishi shart (musbat).");
    if (!Number.isFinite(price_per_ton) || price_per_ton <= 0) {
        throw new Error("price_per_ton kiritilishi shart (musbat).");
    }
    if (!currency) throw new Error("currency kiritilishi shart (UZS yoki USD).");

    let total = tons * price_per_ton;

    if (currency === "USD") {
        if (!Number.isFinite(usd_rate) || usd_rate <= 0) {
            throw new Error("USD kursi (usd_rate) kiritilishi shart (musbat).");
        }
        total *= usd_rate;
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