import axios from "axios";

// 1. Point directly to your live Render backend
const BACKEND_URL = "https://syncspace-sjne.onrender.com";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Automatically attach the JWT Token so you stay logged in!
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
