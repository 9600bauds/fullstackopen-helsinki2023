import React from 'react';
import WeatherService from '../services/WeatherService';
import { useState, useEffect } from 'react'

const WeatherDetails = ({ country }) => {

    const[props, setProps] = useState([]) //Is it proper to store the weather state here?

    useEffect(() => {
        WeatherService.getByCountryObj(country)
        .then(response => {
            setProps(response)
        })
        .catch(error => {
            alert(`Couldn't load weather data! Error: ${error}`)
        })
    }, [country]) //Update whenever country changes

    if(!country || !props || props.length < 1){
        return
    }

    // Get the weather icon URL based on the icon code
    const iconUrl = `http://openweathermap.org/img/w/${props.weather[0].icon}.png`;

    return (
    <div>
      <h2>Weather Information for {country.name.common}</h2>
      <p>Temperature: {(props.main.temp - 273.15).toFixed(1)} C</p>
      <p>Feels Like: {(props.main.feels_like - 273.15).toFixed(1)} C</p>
      <p>Humidity: {props.main.humidity}%</p>
      <p>Wind Speed: {props.wind.speed} m/s</p>
      <p>Description: {props.weather[0].description} <img src={iconUrl} alt="Weather Icon" /></p>
    </div>
    );
};

export default WeatherDetails;