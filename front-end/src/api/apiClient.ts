import axios from "axios";

// Làm sạch biến môi trường để loại bỏ ký tự lạ, khoảng trắng hay dấu ngoặc
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const cleanUrl = rawUrl.replace(/[\[\]()]/g, "").trim();

const api = axios.create({
  baseURL: cleanUrl,
  timeout: 30000,
});

export default api;