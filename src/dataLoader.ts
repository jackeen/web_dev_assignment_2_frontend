import axios from "axios";
import {API_HOST} from "../configure.ts";

const instance = axios.create({
    baseURL: API_HOST,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Token ${localStorage.getItem("token")}`,
    }
});

export default instance;