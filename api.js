import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) alert("Network error!");
    else {
      switch (error.response.status) {
        case 400: alert("Bad Request!"); break;
        case 401: alert("Unauthorized! Please login."); break;
        case 403: alert("Forbidden!"); break;
        case 404: alert("Not Found!"); break;
        case 500: alert("Server Error!"); break;
        default: alert("Error: " + error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
