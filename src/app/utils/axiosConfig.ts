import axios from 'axios';
import authStorage from '../storage/auth';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Ensure this env variable is set
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If your API requires cookies (JWT or session-based auth)
});

// List of public endpoints that don't require JWT token
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/refresh',
  '/users/register',
  '/users/verify-email',
  '/users/checkVerifyCode',
  '/chatbot/message',
];

// Add an interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if this is a public endpoint
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.includes(endpoint)
    );

    // Only add Authorization header for non-public endpoints
    if (!isPublicEndpoint) {
      // Get the access token from cookies
      const accessToken = authStorage.getAccessToken();

      // If there is an access token, attach it to the request headers
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
