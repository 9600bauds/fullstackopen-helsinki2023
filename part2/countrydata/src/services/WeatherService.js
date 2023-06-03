import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = process.env.REACT_APP_API_KEY

const getByCountryObj = (country) => {
    let lat = country.latlng[0]
    let lng = country.latlng[1]
    if(!lat || !lng){
        alert("Incorrect country object passed to WeatherService!")
        console.log("Incorrect country object passed to WeatherService!", country)
    }
    return getByLatLon(lat, lng)
}

const getByLatLon = (lat, lon) => {
  const request = axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  return request.then(response => response.data)
}

export default { getByCountryObj, getByLatLon }