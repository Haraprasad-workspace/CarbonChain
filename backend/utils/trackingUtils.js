// Generate unique Digital Waste Passport ID
const generatePassportId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();

    const random = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `CC-${timestamp}-${random}`;
};


// Convert shipment status to lifecycle status
const getLifecycleStatus = (shipmentStatus) => {
    const statusMap = {
        CREATED: "REGISTERED",
        ASSIGNED: "MATCHED",
        PICKUP_SCHEDULED: "COLLECTED",
        PICKED_UP: "COLLECTED",
        IN_TRANSIT: "IN_TRANSIT",
        DELIVERED: "RECEIVED",
        CANCELLED: "REGISTERED"
    };

    return statusMap[shipmentStatus] || "REGISTERED";
};


// Generate event description
const getTrackingEventDescription = (status) => {
    const descriptions = {
        REGISTERED: "Waste batch registered on CarbonChain",
        MATCHED: "Waste matched with a suitable facility",
        NEGOTIATED: "Price negotiation completed",
        PAID: "Transaction payment completed",
        COLLECTED: "Waste collected from generator",
        IN_TRANSIT: "Waste is currently in transit",
        RECEIVED: "Waste received at processing facility",
        PROCESSED: "Waste processed and carbon impact recorded"
    };

    return (
        descriptions[status] ||
        "Waste lifecycle status updated"
    );
};


// Calculate shipment progress percentage
const calculateTrackingProgress = (status) => {
    const progressMap = {
        CREATED: 10,
        ASSIGNED: 20,
        PICKUP_SCHEDULED: 30,
        PICKED_UP: 45,
        IN_TRANSIT: 65,
        DELIVERED: 85,
        PROCESSED: 100,
        CANCELLED: 0
    };

    return progressMap[status] || 0;
};


module.exports = {
    generatePassportId,
    getLifecycleStatus,
    getTrackingEventDescription,
    calculateTrackingProgress
};