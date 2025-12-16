import axios from "axios";

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return "/api";
};

const axiosClient = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chatToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("chatToken");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
