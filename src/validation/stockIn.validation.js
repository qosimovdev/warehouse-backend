
const Joi = require("joi");

const positive = Joi.number().positive();

exports.createStockInSchema = Joi.object({
    productId: Joi.string()
        .length(24)
        .hex()
        .required(),
    productType: Joi.string()
        .valid("rebar", "non-rebar")
        .required(),
    tons: positive.optional(),
    currency: Joi.string().valid("UZS", "USD").required(),
    usdRateUsed: positive.optional(),
    diameterMm: positive.optional(),
    pieces: positive.optional(),
    pieceLengthM: positive.optional(),
    kgPerM: positive.optional(),
    metersPerTon: positive.optional(),
    pricePerTon: positive.required(),
})
    .custom((value, helpers) => {
        const { productType } = value;

        if (productType === "rebar") {
            const hasPieces =
                value.pieces && value.pieceLengthM;
            const hasTons =
                value.tons && (value.kgPerM || value.diameterMm);
            if (!hasPieces && !hasTons) {
                return helpers.message(
                    "Armatura (rebar) uchun metrni hisoblashga yetarli ma'lumot kiriting: (dona soni va uzunligi) YOKI (tonna va 1 metr og'irligi) (yoki diametri)."
                );
            }
        }

        if (productType === "non-rebar") {
            if (!value.tons) {
                return helpers.message(
                    "non-rebar uchun tonna kiritilishi shart"
                );
            }

            if (!value.kgPerM && !value.metersPerTon) {
                return helpers.message(
                    "Armatura bo'lmagan mahsulot (non-rebar) uchun 1 metr og'irligi (kgPerM) yoki 1 tonnada necha metr borligi (metersPerTon) kiritilishi shart."
                );
            }
        }

        // USD tekshiruvi
        if (value.currency === "USD" && !value.usdRate) {
            return helpers.message(
                "Valyuta USD bo'lsa, 1 dollar kursini (usdRate) kiritishingiz shart."
            );
        }

        return value;
    });
