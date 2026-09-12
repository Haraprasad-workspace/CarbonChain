import api from "./api";

export const createShipment = async (shipmentData) => {
    const response = await api.post("/shipments", shipmentData);
    return response.data;
};

export const getMyShipments = async () => {
    const response = await api.get("/shipments/my");
    return response.data;
};

export const getShipment = async (id) => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
};

export const assignLogisticsProvider = async (id, providerData) => {
    const response = await api.put(
        `/shipments/${id}/assign`,
        providerData
    );
    return response.data;
};

export const updateShipmentStatus = async (id, status) => {
    const response = await api.put(
        `/shipments/${id}/status`,
        { status }
    );
    return response.data;
};