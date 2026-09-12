import api from "./api";

// Create payment for accepted negotiation
export const createPayment = async (negotiationId) => {
    const response = await api.post("/payments", {
        negotiationId
    });

    return response.data;
};

// Get payments for current user
export const getMyPayments = async () => {
    const response = await api.get("/payments/my");

    return response.data;
};

// Get single payment
export const getPayment = async (id) => {
    const response = await api.get(`/payments/${id}`);

    return response.data;
};

// Verify / complete payment
export const verifyPayment = async (paymentId, paymentData = {}) => {
    const response = await api.post(
        `/payments/${paymentId}/verify`,
        paymentData
    );

    return response.data;
};

// Cancel pending payment
export const cancelPayment = async (id) => {
    const response = await api.put(
        `/payments/${id}/cancel`
    );

    return response.data;
};