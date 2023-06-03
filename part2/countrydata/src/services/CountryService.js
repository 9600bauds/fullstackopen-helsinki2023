import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const searchName = (input) => {
    const request = axios.get(`${baseUrl}/all`);
    return request.then((response) => {
      const data = response.data;
      const filteredData = data.filter((country) =>
        country.name.common.toLowerCase().includes(input.toLowerCase())
      );
      return filteredData;
    });
  };

const getByName = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`)
  return request.then(response => response.data)
}

export default { getAll, getByName, searchName }