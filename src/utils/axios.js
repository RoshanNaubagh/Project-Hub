import axios from 'axios';

// ----------------------------------------------------------------------
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`
});

axiosInstance.interceptors.request.use((req) => {
  const idToken = localStorage.getItem('hub.idToken');
  req.headers.Authorization = `Bearer ${idToken}`;
  return req;
});

axiosInstance.interceptors.response.use(
  ({ data }) => {
    // may not be required now
    delete data.$id;
    if (Object.prototype.hasOwnProperty.call(data, '$values')) {
      return { data: data.$values };
    }
    return { data };
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
