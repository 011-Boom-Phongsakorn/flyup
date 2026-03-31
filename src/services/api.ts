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

export default instance;