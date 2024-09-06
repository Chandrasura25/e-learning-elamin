import axios from 'axios';

const BASE_URL: string = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add an interceptor to axiosPrivate for attaching the token to requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to set up interceptors, including handling the 'Unauthenticated' error
export const setupInterceptors = (logout, navigate) => {
  axiosPrivate.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.data.message === 'Unauthenticated.') {
         localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user'); // Call the logout function
        navigate('/login'); // Redirect to the login page
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance, axiosPrivate };
