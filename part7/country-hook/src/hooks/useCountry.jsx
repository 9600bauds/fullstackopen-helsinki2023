import axios from "axios";
import { useState, useEffect } from "react";

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  //Ideally this would go in a service or similar.
  //Ideally this would also have props validation et al.
  async function fetch(countryName){
    if(!countryName || countryName === ''){
      setCountry(null)
      return
    }
    try{
      const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`) //Hardcoded base URL, you know how it goes
      const countryObject = {...response.data, found: true} //The Country component expects a "found" field
      //console.log("Found country: ", countryObject)
      setCountry(countryObject)
    }
    catch{
      setCountry({found: false})
    }
  }
  useEffect(() => 
    {
      fetch(name)
    }, [name]);

  return country;
};
