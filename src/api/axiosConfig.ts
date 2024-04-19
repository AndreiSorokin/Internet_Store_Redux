import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/v1/users/refreshToken', {}, { withCredentials: true });
    console.log('response',response)
    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);// from here
    throw new Error('Failed to refresh access token');
  }
};

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer  ${newAccessToken}`;
        localStorage.setItem('token', newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;