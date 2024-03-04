import axios from 'axios';

// ----------------------------------------------------------------------
export const DOMAIN = 'http://localhost:8080/api/v1'
export const USER_LOGIN = 'userLogin'
export const ACCESSTOKEN = 'accessToken'
const axiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESSTOKEN)
  config.headers = {
    ...config.headers,
    ['Authorization']: token ? `Bearer ${token}` : '',
    // ['']: "",

  }
  return config;
}, (error) => { return Promise.reject(error) })
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
// );

export default axiosInstance;
