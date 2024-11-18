import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const object = { content, votes: 0 };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const update = async (id, updatedAnecdote) => {
  const resourceURL = baseUrl + "/" + id;
  //Ideally, this would use some sort of atomic operation.
  //But we're just mocking a proper database with a fake JSONserver that does not even support that. So we don't care too much.
  const response = await axios.put(resourceURL, updatedAnecdote);
  return response.data; //Return the updated anecdote as per the server
};

export default { getAll, createNew, update };
