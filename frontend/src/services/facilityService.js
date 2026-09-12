import api from "./api";

// Register a new facility
export const createFacility = async (facilityData) => {
    const response = await api.post("/facilities", facilityData);
    return response.data;
};

// Get facilities owned by current user
export const getMyFacilities = async () => {
    const response = await api.get("/facilities/my");
    return response.data;
};

// Get single facility
export const getFacility = async (id) => {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
};

// Update facility
export const updateFacility = async (id, facilityData) => {
    const response = await api.put(
        `/facilities/${id}`,
        facilityData
    );

    return response.data;
};

// Delete facility
export const deleteFacility = async (id) => {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
};

// Get all active and verified facilities
export const getActiveFacilities = async () => {
    const response = await api.get("/facilities/active/all");
    return response.data;
};

// Find facility matches for a waste batch
export const findWasteMatches = async (wasteId) => {
    const response = await api.get(
        `/matching/waste/${wasteId}`
    );

    return response.data;
};

// Get existing matches
export const getWasteMatches = async (wasteId) => {
    const response = await api.get(
        `/matching/waste/${wasteId}/all`
    );

    return response.data;
};

// Accept a facility match
export const acceptMatch = async (matchId) => {
    const response = await api.put(
        `/matching/${matchId}/accept`
    );

    return response.data;
};

// Reject a facility match
export const rejectMatch = async (matchId) => {
    const response = await api.put(
        `/matching/${matchId}/reject`
    );

    return response.data;
};