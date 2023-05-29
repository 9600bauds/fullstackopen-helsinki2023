import React from 'react'
import { useState } from 'react'
import Filter from './components/Filter'
import FilteredEntries from './components/FilteredEntries'
import EntryInput from './components/EntryInput'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('') //is there really no better way to track the input's state?
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  function entryAlreadyExists(entry){ //is the arrow notation necessary here?
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
    if(!newName || !newNumber){
      alert(`You must input a name and a phone number.`)
      return      
    }
    
    const newEntry = {name: newName, number: newNumber, id: persons.length + 1}
    if(entryAlreadyExists(newEntry)){
      alert(`${newName} is already listed in the phonebook!`)
      return
    }
    setPersons(persons.concat(newEntry))
  }

  const nameChanged = (event) => {
    setNewName(event.target.value)
  }
  const numberChanged = (event) => {
    setNewNumber(event.target.value)
  }
  const filterChanged = (event) => {
    setFilter(event.target.value.toLowerCase())
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterChanged={filterChanged} />

      <h3>Add New</h3>
      <EntryInput addEntry={addEntry} nameChanged={nameChanged} numberChanged={numberChanged} />
      
      <h3>Numbers</h3>
      <FilteredEntries entries={persons} filter={filter} />
    </div>
  )
}

export default App