const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
};


const calculateMatchScore = (waste, facility) => {
    let score = 0;

    // 1. Waste type compatibility - 40 points
    const wasteType = waste.wasteType.toLowerCase();

    const compatible = facility.acceptedWasteTypes.some(
        (type) =>
            type.toLowerCase() === wasteType
    );

    if (!compatible) {
        return null;
    }

    score += 40;


    // 2. Distance - 30 points
    const distance = calculateDistance(
        waste.location.latitude,
        waste.location.longitude,
        facility.location.latitude,
        facility.location.longitude
    );

    if (distance <= 10) {
        score += 30;
    } else if (distance <= 25) {
        score += 25;
    } else if (distance <= 50) {
        score += 20;
    } else if (distance <= 100) {
        score += 10;
    }


    // 3. Capacity - 20 points
    const wasteQuantity =
        waste.quantity.unit === "KG"
            ? waste.quantity.value / 1000
            : waste.quantity.value;

    const facilityCapacity =
        facility.processingCapacity.unit ===
        "KG_PER_DAY"
            ? facility.processingCapacity.value / 1000
            : facility.processingCapacity.value;

    if (facilityCapacity >= wasteQuantity) {
        score += 20;
    } else if (facilityCapacity >= wasteQuantity * 0.5) {
        score += 10;
    }


    // 4. Operational status - 10 points
    if (facility.operationalStatus === "ACTIVE") {
        score += 10;
    }


    return {
        score,
        distance: Number(distance.toFixed(2))
    };
};


module.exports = {
    calculateDistance,
    calculateMatchScore
};