import api from "./api";

// Create digital waste passport
export const createWastePassport = async (wasteBatchId) => {
    const response = await api.post("/tracking/passports", {
        wasteBatchId
    });

    return response.data;
};

// Get passport for a specific waste batch
export const getPassportByWaste = async (wasteBatchId) => {
    const response = await api.get(
        `/tracking/passports/waste/${wasteBatchId}`
    );

    return response.data;
};

// Get all passports for current user
export const getMyPassports = async () => {
    const response = await api.get("/tracking/passports/my");

    return response.data;
};

// Sync shipment tracking with digital passport
export const syncShipmentTracking = async (shipmentId) => {
    const response = await api.post(
        `/tracking/shipment/${shipmentId}/sync`
    );

    return response.data;
};

// Sync carbon record with digital passport
export const syncCarbonRecord = async (wasteBatchId) => {
    const response = await api.post(
        `/tracking/carbon/${wasteBatchId}/sync`
    );

    return response.data;
};