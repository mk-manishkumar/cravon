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

const handleAuthRedirect = (wasLoggedIn: boolean) => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;

  // Don't redirect if already on an auth page or handling an invite
  if (currentPath.includes("/login") || currentPath.includes("/accept-invite")) return;

  if (currentPath.startsWith("/partner") || currentPath.startsWith("/staff")) {
    window.location.href = "/auth/restaurant/login";
    return;
  }

  if (currentPath.startsWith("/admin")) {
    window.location.href = "/auth/admin/login";
    return;
  }

  // Customer routes logic
  const isPublicCustomerRoute = currentPath === "/" || currentPath.startsWith("/restaurants") || currentPath.startsWith("/offers") || currentPath.startsWith("/cart");

  if (!isPublicCustomerRoute || wasLoggedIn) {
    window.location.href = "/auth/login";
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const wasLoggedIn = !!useAuthStore.getState().user;
      useAuthStore.setState({ user: null });
      handleAuthRedirect(wasLoggedIn);
    }
    return Promise.reject(error);
  },
);

export default api;
