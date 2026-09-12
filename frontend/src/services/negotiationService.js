import api from "./api";

// Create a new negotiation
export const createNegotiation = async (negotiationData) => {
    const response = await api.post(
        "/negotiations",
        negotiationData
    );

    return response.data;
};

// Get generator negotiations
export const getGeneratorNegotiations = async () => {
    const response = await api.get(
        "/negotiations/generator"
    );

    return response.data;
};

// Get facility negotiations
export const getFacilityNegotiations = async () => {
    const response = await api.get(
        "/negotiations/facility"
    );

    return response.data;
};

// Get single negotiation
export const getNegotiation = async (id) => {
    const response = await api.get(
        `/negotiations/${id}`
    );

    return response.data;
};

// Submit offer / counter offer
export const submitOffer = async (id, offerData) => {
    const response = await api.post(
        `/negotiations/${id}/offer`,
        offerData
    );

    return response.data;
};

// Accept current offer
export const acceptOffer = async (id) => {
    const response = await api.put(
        `/negotiations/${id}/accept`
    );

    return response.data;
};

// Reject current offer
export const rejectOffer = async (id) => {
    const response = await api.put(
        `/negotiations/${id}/reject`
    );

    return response.data;
};