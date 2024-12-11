import axios from 'axios';
const baseUrl = `/api/users`;

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

/**
 * Not implemented in the backend yet
 */
const getById = async (id) => {
  const request = axios.get(`baseUrl/${id}`);
  const response = await request;
  return response.data;
};

export default { getAll, getById };