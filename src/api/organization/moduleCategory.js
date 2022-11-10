import axios from '../../utils/axios';

const BASE_ENDPOINT = '/moduleCategories';
const API = {
  GET: () => axios.get(BASE_ENDPOINT),
  GETBYID: (id) => axios.get(`${BASE_ENDPOINT}/${id}`),
  GET_BY_MODULE_ID: (id) => axios.get(`${BASE_ENDPOINT}/module/${id}`),
  POST: (formData) => axios.post(BASE_ENDPOINT, formData),
  PUT: (id, formData) => axios.put(`${BASE_ENDPOINT}/${id}`, formData),
  DELETE: (id) => axios.delete(`${BASE_ENDPOINT}/${id}`)
};

export default API;
