import axios from 'axios';
const baseUrl = `/api/users`;

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const getOne = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  const response = await request;
  return response.data;
};

export default { getAll, getOne };