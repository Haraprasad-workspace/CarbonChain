import api from "./api";

export const verifyAadhaar = async (aadhaarNumber) => {
    const response = await api.post("/verification/aadhaar", {
        aadhaarNumber
    });

    return response.data;
};

export const verifyGST = async (gstin) => {
    const response = await api.post("/verification/gst", {
        gstin
    });

    return response.data;
};

export const getVerificationStatus = async () => {
    const response = await api.get("/verification/status");

    return response.data;
};