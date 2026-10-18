import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

export default api;

// axios.get("http://localhost:5000/api/products"); -> api.get("/products");