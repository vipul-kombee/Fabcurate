import api from "./Api";

export const getData = async (endpoint: string, params?: any) => {
    console.log("API END POINT:", endpoint);
    console.log("API PARAMS:", params);
    try {
        const response = await api.get(endpoint, { params });
        console.log("API RESPONSE:", response?.data);
        return response.data;
    } catch (error) {
        console.log("API ERROR:", error);
        throw error;
    }
};
