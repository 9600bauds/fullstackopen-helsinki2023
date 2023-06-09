import React from 'react';
import WeatherDetails from './WeatherDetails';

const CountryDetails = ({ country }) => {
  const { name, capital, area, languages, flags } = country;

  return (
    <div>
      <h2>{name.common}</h2>
      <p>Capital: {capital[0]}</p>
      <p>Area: {area} square kilometers</p>
      <p>Languages: {Object.values(languages).join(', ')}</p>
      <img src={flags.png} alt={`Flag of ${name.common}`} />
      <WeatherDetails country={country} />
    </div>
  );
};

export default CountryDetails;