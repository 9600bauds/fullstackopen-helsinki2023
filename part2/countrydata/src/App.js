import { useState, useEffect } from 'react'
import NameInput from './components/NameInput';
import CountryList from './components/CountryList';
import CountryService from './services/CountryService';

function App() {
  const [textInput, setTextInput] = useState('')
  const [searchResults, setSearchResults] = useState([])

  function selectCountry(country){
    setSearchResults([country]) //This works
  }

  useEffect(() => {
    if(!textInput){
      setSearchResults([])
      return
    }
    CountryService.searchName(textInput)
    .then(response => {
      setSearchResults(response)
    })
    .catch(error => {
      alert(`Couldn't load server data! Error: ${error}`)
    })
  }, [textInput]) //Update whenever textInput changes

  return (
    <div className="App">
      <h3>Find Country By Name</h3>
      <NameInput textInput={textInput} setTextInput={setTextInput}/>

      <CountryList countries={searchResults} selectCountry={selectCountry} />      

    </div>
  );
}

export default App;
