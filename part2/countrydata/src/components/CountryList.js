import React from 'react';
import CountryEntry from './CountryEntry';
import CountryDetails from './CountryDetails';

const CountryList = ({ countries, selectCountry }) => {
    if(countries.length === 0){
        return (<div>No results found.</div>)
    }
    else if(countries.length === 1){
        return (<CountryDetails country={countries[0]} />)
    }
    else if(countries.length > 10){
        return (<div>Too many results, please try another search filter</div>)
    }
    else return (
        <div>
            <ul>
            {countries.map(country =>
                <CountryEntry key={country.name.common} country={country} selectCountry={selectCountry} />
            )}
            </ul>
        </div>
    );

};

export default CountryList;