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

// Auth is handled via HttpOnly cookie (set by backend on signin/OAuth/selectRole).
// withCredentials: true above ensures browser sends the cookie on every request.

export default instance;