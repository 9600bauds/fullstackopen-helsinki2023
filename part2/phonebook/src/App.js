import React from 'react'
import { useState, useEffect } from 'react'
import PersonService from './services/PersonService'
import Filter from './components/Filter'
import FilteredEntries from './components/FilteredEntries'
import EntryInput from './components/EntryInput'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('') //is there really no better way to track the input's state?
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  function entryAlreadyExists(entry){
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
    const existingEntry = persons.find(person => person.name === newName);
    if(existingEntry){
      console.log(existingEntry.name, "already exists!")
      updateEntry(existingEntry, newNumber)
      return
    }
    
    const newEntry = {name: newName, number: newNumber}
    PersonService.create(newEntry)
    .then(response => {
      setPersons(persons.concat(response))
    })
    .catch(error => {
      alert(`Failed to create new person! Error: ` + error)
    })
  }

  const updateEntry = (oldEntry, newNumber) => {
      const newEntry = { ...oldEntry, number: newNumber }
      PersonService.update(oldEntry.id, newEntry)
      .then(response => {
        const newState = persons.map(p => p.id !== newEntry.id ? p : response)
        setPersons(newState)
      })
      .catch(error => {
        alert(`Failed to update person! Error: ` + error)
      })
  }

  const deleteHook = (id, label) => {
    if (!window.confirm("Really delete " + label + "?")) {
      return
    }
    PersonService.deleteByID(id)
    .then(() => {
      const newState = persons.filter(person => person.id !== id) //Get the persons array, sans this entry. Seems inefficient.
      setPersons(newState) 
    })
    .catch(() => {
      console.error(`Person with ID ${id} was already deleted!`)
      const newState = persons.filter(person => person.id !== id) //go ahead and remove anyways
      setPersons(newState) 
    })
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

  //Let's import the persons data from our DB.
  useEffect(() => {
    PersonService.getAll()
    .then(response => {
      setPersons(response)
    })
    .catch(error => {
      alert(`Couldn't load server data! Error: ` + error)
    })
  }, []) //Empty array because we want to call this only once, in the initial render

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filterChanged={filterChanged} />

      <h3>Add New</h3>
      <EntryInput addEntry={addEntry} nameChanged={nameChanged} numberChanged={numberChanged} />
      
      <h3>Numbers</h3>
      <FilteredEntries entries={persons} filter={filter} deleteHook={deleteHook} />
    </div>
  )
}

export default App