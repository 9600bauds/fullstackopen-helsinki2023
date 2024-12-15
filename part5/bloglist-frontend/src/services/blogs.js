import axios from 'axios';
const baseUrl = `/api/blogs`;


let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getOne = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  const response = await request;
  return response.data;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  const response = await request;
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  await request;
  return id;
};

const addComment = async (id, comment) => {
  const request = axios.post(`${baseUrl}/${id}/comments`, { comment }); //The thing we put needs to be an object, containing the "comment" field
  const response = await request;
  return response.data;
};

export default { getAll, getOne, create, update, remove, addComment, setToken };