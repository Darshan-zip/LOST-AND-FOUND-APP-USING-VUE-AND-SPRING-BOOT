// src/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// attach token + log every outgoing request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 Outgoing request:", config.url, "Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
