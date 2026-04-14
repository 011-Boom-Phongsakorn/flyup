import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// iOS Safari blocks cross-site cookies (ITP) — use token from localStorage instead
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;