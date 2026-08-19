import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user state on 401
      useAuthStore.setState({ user: null });

      // If we are on the client side, we can safely redirect
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Don't redirect if we are already on a login page to avoid loops
        if (!currentPath.includes("/login")) {
          if (currentPath.startsWith("/partner") || currentPath.startsWith("/staff")) {
            window.location.href = "/auth/restaurant/login";
          } else if (currentPath.startsWith("/admin")) {
            window.location.href = "/auth/admin/login";
          } else if (currentPath !== "/") {
            window.location.href = "/auth/login";
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
