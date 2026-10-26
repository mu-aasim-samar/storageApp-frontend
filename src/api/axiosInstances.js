import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Instance for authenticated requests (includes session cookies)
export const axiosWithCreds = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Instance for public requests
export const axiosWithoutCreds = axios.create({
  baseURL: BASE_URL,
});

// Automatically redirect to /login on 401 for authenticated endpoints
axiosWithCreds.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
