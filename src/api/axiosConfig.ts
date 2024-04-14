import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: 'http://localhost:8080/api/v1/users/refreshToken',
   withCredentials: true,
});

axiosInstance.interceptors.response.use(
   (response) => response, 
   async (error) => {
         const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         try {
         await axios.get('/refresh_token_endpoint', { withCredentials: true });
         return axiosInstance(originalRequest);
         } catch (refreshError) {
         return Promise.reject(refreshError);
         }
      }
      return Promise.reject(error);
   }
);

export default axiosInstance;