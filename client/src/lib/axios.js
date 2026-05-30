import axios from "axios";

// Create a custom instance of Axios
const axiosInstance = axios.create({
  // This points directly to your Node.js backend
  baseURL: "http://localhost:3000",

  // These headers will automatically be attached to every single request
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
