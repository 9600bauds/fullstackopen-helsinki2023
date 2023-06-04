import { useState, useEffect } from 'react'
import NameInput from './components/NameInput';
import CountryList from './components/CountryList';
import CountryService from './services/CountryService';

function App() {
  const [textInput, setTextInput] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [searchResults, setSearchResults] = useState([])

  function selectCountry(country){
    setSearchResults([country]) //Works for Sudan!
  }
  
  function filterData(data, filter){
    const filteredData = data.filter((country) => {
      const { name, altSpellings } = country
      const lowerCaseName = name.common.toLowerCase()
      // Check if the main name or any of the alternate spellings include the search term
      return (
        lowerCaseName.includes(filter.toLowerCase()) ||
        altSpellings.some((spelling) => spelling.toLowerCase().includes(filter.toLowerCase()))
      )
    }
    )
    return filteredData
  }

  useEffect(() => {
    CountryService.getAll()
    .then(response => {
      setAllCountries(response)
    })
    .catch(error => {
      alert(`Couldn't load server data! Error: ${error}`)
    })
  }, []) //Initial load

  useEffect(() => {
    setSearchResults(filterData(allCountries, textInput))
  }, [textInput, allCountries]) //Redo the filtering anytime textInput or allCountries changes

  return (
    <div className="App">
      <h3>Find Country By Name</h3>
      <NameInput textInput={textInput} setTextInput={setTextInput}/>

      <CountryList countries={searchResults} selectCountry={selectCountry} />      

    </div>
  );
}

export default App;
