import axios from "axios";
import { CONSTANTS } from "../utils/Constants";

const api = axios.create({
    baseURL: CONSTANTS.BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
