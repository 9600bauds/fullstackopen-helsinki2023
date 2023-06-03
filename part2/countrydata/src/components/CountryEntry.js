import React from 'react';

const CountryEntry = ({ country, selectCountry }) => {
  return (
    <div>
        <li key={country.name.common}>
            {country.name.common} <button value='show' onClick={() => selectCountry(country)}>show</button>
        </li>
    </div>
  );
};

export default CountryEntry;