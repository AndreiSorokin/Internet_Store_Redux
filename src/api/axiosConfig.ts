import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/refreshToken`, {}, { withCredentials: true });
    return response.data.accessToken;
  } catch (error) {
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