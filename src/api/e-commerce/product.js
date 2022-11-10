import axios from '../../utils/axios';

const BASE_ENDPOINT = '/Products';
const API = {
  GET: () => axios.get(BASE_ENDPOINT),
  GETBYID: (id) => axios.get(`${BASE_ENDPOINT}/${id}`),
  POST: (fromData) => axios.post(BASE_ENDPOINT, fromData),
  PUT: (id, fromData) => axios.put(`${BASE_ENDPOINT}/${id}`, fromData),
  DELETE: (id) => axios.delete(`${BASE_ENDPOINT}/${id}`)
};

export default API;
