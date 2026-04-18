import axios from 'axios';

// Detect if we are running in development mode (Vite)
// If in development, point to the Flask server
// If in production (served by Flask), use relative paths
const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? 'http://127.0.0.1:5000' : '';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
