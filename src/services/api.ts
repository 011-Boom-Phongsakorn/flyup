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
//
// Auto-refresh: ถ้า access token หมดอายุ (401) interceptor จะเรียก /auth/refresh
// แล้ว retry request เดิม — ทำครั้งเดียว ถ้า refresh ล้มเหลวก็ logout
let isRefreshing = false;
let refreshQueue: Array<(ok: boolean) => void> = [];

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // ข้ามถ้า: ไม่ใช่ 401, เป็น refresh endpoint เอง, หรือ retry แล้ว
    if (status !== 401 || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // รอให้ refresh เสร็จก่อน แล้วค่อย retry
      return new Promise((resolve, reject) => {
        refreshQueue.push((ok) => ok ? resolve(instance(original)) : reject(error));
      });
    }

    isRefreshing = true;
    try {
      await instance.post("/auth/refresh");
      refreshQueue.forEach((cb) => cb(true));
      return instance(original);
    } catch {
      refreshQueue.forEach((cb) => cb(false));
      // refresh token หมดอายุ — force logout
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
      refreshQueue = [];
    }
  }
);

export default instance;