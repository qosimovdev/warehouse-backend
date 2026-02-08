const { calculateMeters, calculateTotalCostUZS, calculateWeightedAvg, round } = require("../utils/stockCalculations")
const stockCalculations = require("../utils/stockCalculations")

describe("Stock calculations", () => {

    test("non-rebar: tons + kgPerM → meters", () => {
        const meters = stockCalculations.calculateMeters({
            productType: "angle",
            tons: 3,
            kgPerM: 7.85
        })

        expect(meters).toBeCloseTo(382.17, 2)
    })

})

test("rebar: pieces x pieceLengthM", () => {
    const meters = stockCalculations.calculateMeters({
        productType: "rebar",
        pieces: 100,
        pieceLengthM: 12
    })

    expect(meters).toBe(1200)
})

test("rebar: pieces x pieceLengthM", () => {
    const meters = stockCalculations.calculateMeters({
        productType: "rebar",
        pieces: 100,
        pieceLengthM: 12
    })

    expect(meters).toBe(1200)
})

test("total cost USD converted to UZS", () => {
    const total = stockCalculations.calculateTotalCostUZS({
        tons: 3,
        pricePerTon: 620,
        currency: "USD",
        usdRate: 12500
    })

    expect(total).toBe(23250000)
})

test("weighted average calculation", () => {
    const avg = stockCalculations.calculateWeightedAvg({
        oldMeters: 382.17,
        oldAvg: 60837.5,
        newMeters: 382.17,
        newCostPerMeter: 60836.8
    })

    expect(avg).toBeCloseTo(60837.15, 2)
})

test("rounds to 2 decimals", () => {
    expect(round(382.1656)).toBe(382.17)
})
