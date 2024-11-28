import axios from "axios";
import { useEffect, useState } from "react";

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => 
    {
      get(baseUrl)
    }, [baseUrl]); //Run once upon creation, and when the baseUrl is updated

  const get = async (baseUrl) => {
    if(!baseUrl){
      throw new Error("Expected a base url to fetch from!")
    }
    const response = await axios.get(baseUrl)
    setResources(response.data)
  }

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    const newResource = response.data;
    setResources(resources.concat(newResource)) //concat() returns a new array, does not mutate
  };

  const service = {
    get,
    create
  };

  return [
    resources, service
  ];
};
