import axios from "axios";

console.log("MODE:", import.meta.env.MODE);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export default axiosInstance;