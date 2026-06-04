import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
// Create a custom instance of Axios
const axiosInstance = axios.create({
  // This points directly to your Node.js backend
  baseURL: BACKEND_URL,

  // These headers will automatically be attached to every single request
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
