import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
});

// Add a request interceptor to set CSRF and update loading state
axiosInstance.interceptors.request.use(
  (request) => {
    const tokens = secureLocalStorage.getItem('tokens');
    if (tokens && typeof tokens === 'object' && 'access_token' in tokens) {
        request.headers['Authorization'] = `Bearer ${tokens.access_token}`
    }
    return request;
  },
  (error) => {
    console.error('Axios interceptor error', error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // ...
    return response
  },
  (error) => {
    // ...
  }
);

export default axiosInstance;
