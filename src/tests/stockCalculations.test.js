const { calculateMeters, calculateTotalCostUZS, calculateWeightedAvg, round } = require("../utils/stockCalculations")

describe("Stock calculations", () => {

    test("non-rebar: tons + kg_per_m → meters", () => {
        const meters = calculateMeters({
            productType: "angle",
            tons: 3,
            kg_per_m: 7.85
        })

        expect(meters).toBeCloseTo(382.17, 2)
    })

})

test("rebar: pieces x piece_length_m", () => {
    const meters = calculateMeters({
        productType: "rebar",
        pieces: 100,
        piece_length_m: 12
    })

    expect(meters).toBe(1200)
})

test("rebar: pieces x piece_length_m", () => {
    const meters = calculateMeters({
        productType: "rebar",
        pieces: 100,
        piece_length_m: 12
    })

    expect(meters).toBe(1200)
})

test("total cost USD converted to UZS", () => {
    const total = calculateTotalCostUZS({
        tons: 3,
        price_per_ton: 620,
        currency: "USD",
        usd_rate: 12500
    })

    expect(total).toBe(23250000)
})

test("weighted average calculation", () => {
    const avg = calculateWeightedAvg({
        old_meters: 382.17,
        old_avg: 60837.5,
        new_meters: 382.17,
        new_cost_per_meter: 60836.8
    })

    expect(avg).toBeCloseTo(60837.15, 2)
})

test("rounds to 2 decimals", () => {
    expect(round(382.1656)).toBe(382.17)
})
