import axios from "axios";
import {API_HOST} from "../configure.ts";

const instance = axios.create({
    baseURL: API_HOST,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`,
    },
    validateStatus: status => { return status < 500; },
});

// instance.interceptors.request.use(async (config) => {
//     // Introduce a delay before the request
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     return config; // Proceed with the request
// });

export default instance;