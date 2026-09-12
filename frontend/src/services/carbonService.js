import api from "./api";

export const createCarbonRecord = async (carbonData) => {
    const response = await api.post("/carbon", carbonData);
    return response.data;
};

export const getCarbonRecord = async (id) => {
    const response = await api.get(`/carbon/${id}`);
    return response.data;
};

export const getMyCarbonRecords = async () => {
    const response = await api.get("/carbon/my");
    return response.data;
};

export const getFacilityCarbonRecords = async () => {
    const response = await api.get("/carbon/facility");
    return response.data;
};

export const getCarbonSummary = async () => {
    const response = await api.get("/carbon/summary");
    return response.data;
};