const carbonFactors = {
    ORGANIC: {
        BIOCHAR: 0.35,
        BIOGAS: 0.25,
        COMPOSTING: 0.15
    },

    AGRICULTURAL: {
        BIOCHAR: 0.40,
        BIOGAS: 0.30,
        COMPOSTING: 0.18
    },

    FOOD: {
        BIOCHAR: 0.35,
        BIOGAS: 0.28,
        COMPOSTING: 0.18
    },

    PLASTIC: {
        RECYCLING: 1.50,
        WASTE_TO_ENERGY: 0.80
    },

    PAPER: {
        RECYCLING: 1.00,
        WASTE_TO_ENERGY: 0.60
    },

    METAL: {
        RECYCLING: 2.00
    },

    OTHER: {
        WASTE_TO_ENERGY: 0.50,
        RECYCLING: 0.30
    }
};

const calculateCarbonImpact = (
    wasteType,
    quantity,
    unit,
    processingMethod
) => {
    const type = wasteType.toUpperCase();

    const factors = carbonFactors[type] || carbonFactors.OTHER;

    const factor = factors[processingMethod];

    if (factor === undefined) {
        return null;
    }

    const quantityInTon =
        unit === "KG"
            ? quantity / 1000
            : quantity;

    const co2eAvoided = quantityInTon * factor;

    return {
        carbonFactor: factor,
        co2eAvoided: Number(co2eAvoided.toFixed(3)),
        unit: "TON_CO2E"
    };
};

module.exports = {
    carbonFactors,
    calculateCarbonImpact
};