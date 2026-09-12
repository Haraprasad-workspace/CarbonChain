import api from "./api";

// Register new waste batch
export const createWasteBatch = async (wasteData) => {
    const response = await api.post("/waste", wasteData);
    return response.data;
};

// Get all waste batches of current generator
export const getMyWasteBatches = async () => {
    const response = await api.get("/waste/my");
    return response.data;
};

// Get single waste batch
export const getWasteBatch = async (id) => {
    const response = await api.get(`/waste/${id}`);
    return response.data;
};

// Update waste batch
export const updateWasteBatch = async (id, wasteData) => {
    const response = await api.put(`/waste/${id}`, wasteData);
    return response.data;
};

// Cancel waste batch
export const cancelWasteBatch = async (id) => {
    const response = await api.delete(`/waste/${id}`);
    return response.data;
};