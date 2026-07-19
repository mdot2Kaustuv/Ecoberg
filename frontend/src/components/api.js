import axios from "axios";

// Points straight at Django's dev server, bypassing the need for a Vite proxy.
// Change this if your Django server runs on a different port.
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // sends session cookies cross-origin; harmless to leave on if you use JWT instead
});

export default api;