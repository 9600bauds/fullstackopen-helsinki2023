import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const create = async (newObject, token) => {

    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = async (id, newObject) => {
    const response = await axios.put(`${ baseUrl }/${id}`, newObject);
    return response.data;
};


export default { getAll, create, update };