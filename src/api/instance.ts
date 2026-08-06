
import axios from 'axios';

const Backend_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Create instance with defaults
const apiClient = axios.create({
  baseURL: Backend_URL,
  // timeout: 10000,
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default apiClient;


