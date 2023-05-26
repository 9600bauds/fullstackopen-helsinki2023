import { useState } from 'react'
import PhonebookEntry from './components/PhonebookEntry'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('') //is there really no better way to track the input's state?

  const entryAlreadyExists = (entry) => { //is the arrow notation necessary here?
    let exists = false;
    persons.forEach(person => {
      if (person.name === entry.name) {
        exists = true; //we're 2 functions deep right now so we need to use a flag...
        return; // this will prematurely exit the loop
      }
    });
    return exists;
  }

  const addEntry = (event) => {    
    event.preventDefault() //do not refresh, do not pass go, do not collect 200$
    const newEntry = {name: newName}
    
    if(entryAlreadyExists(newEntry)){
      alert(`${newName} is already listed in the phonebook!`)
      return
    }
    setPersons(persons.concat(newEntry))
  }

  const formChanged = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addEntry}>
        <div>
          name: <input onChange={formChanged} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person =>
        <PhonebookEntry key={person.name} name={person.name} />
      )}
    </div>
  )
}

export default App