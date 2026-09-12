const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

const optimizeRoute = (pickup, delivery) => {
    const distance = calculateDistance(
        pickup.latitude,
        pickup.longitude,
        delivery.latitude,
        delivery.longitude
    );

    // Approximate average speed: 40 km/h
    const estimatedTime = (distance / 40) * 60;

    return {
        distance: Number(distance.toFixed(2)),
        estimatedTime: Math.ceil(estimatedTime)
    };
};

module.exports = {
    calculateDistance,
    optimizeRoute
};