import axios from "axios";
import { useAppStore } from "../store/useAppStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated } = useAppStore.getState();
      // Only hard-redirect if the user had an active session (stale cookie).
      // A 401 from the startup /auth/me check just means "not logged in" — no redirect.
      if (isAuthenticated) {
        useAppStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
