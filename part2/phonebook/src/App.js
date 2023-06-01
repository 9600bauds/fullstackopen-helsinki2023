import React from 'react'
import { useState, useEffect } from 'react'
import PersonService from './services/PersonService'
import Filter from './components/Filter'
import FilteredEntries from './components/FilteredEntries'
import EntryInput from './components/EntryInput'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('') //is there really no better way to track the input's state?
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

  function showSuccessMessage(text, time){
    setSuccessMessage(text)
    setTimeout(() => {
      setSuccessMessage(null)
    }, time)
  }  
  function showErrorMessage(text, time){
    setErrorMessage(text)
    setTimeout(() => {
      setErrorMessage(null)
    }, time)
  }
  
  const addEntry = (event) => {    
    event.preventDefault() //do not refresh, do not pass go, do not collect 200$
    if(!newName || !newNumber){
      showErrorMessage(`You must input a name and a phone number.`, 5000)
      return      
    }
    const existingEntry = persons.find(person => person.name === newName);
    if(existingEntry){
      updateEntry(existingEntry, newNumber)
      return
    }
    
    const newEntry = {name: newName, number: newNumber}
    PersonService.create(newEntry)
    .then(response => {
      setPersons(persons.concat(response))
      showSuccessMessage(`Successfully added ${newEntry.name}.`, 5000)
    })
    .catch(error => {
      showErrorMessage(`Failed to create new person! Error: ` + error, 5000)
    })
  }

  const updateEntry = (oldEntry, newNumber) => {
      const newEntry = { ...oldEntry, number: newNumber }
      PersonService.update(oldEntry.id, newEntry)
      .then(response => {
        const newState = persons.map(p => p.id !== newEntry.id ? p : response)
        setPersons(newState)
        showSuccessMessage(`Successfully updated ${newEntry.name} to a new number.`, 5000)
      })
      .catch(error => {
        showErrorMessage(`Failed to update person! Error: ` + error, 5000)
      })
  }

  const deleteHook = (id) => {
    const person = persons.find(p => p.id === id)
    if (!window.confirm(`Really delete ${person.name}?`)) {
      return
    }
    PersonService.deleteByID(id)
    .then(() => {
      const newState = persons.filter(person => person.id !== id) //Get the persons array, sans this entry. Seems inefficient.
      setPersons(newState)
      showSuccessMessage(`Successfully deleted ${person.name}.`, 5000)
    })
    .catch((error) => {
      showErrorMessage(`Could not delete ${person.name}! Error: ${error}`, 5000)

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
      showErrorMessage(`Couldn't load server data! Error: ${error}`, 5000)
    })
  }, []) //Empty array because we want to call this only once, in the initial render

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} className="notification error" />
      <Notification message={successMessage} className="notification success" />

      <Filter filterChanged={filterChanged} />

      <h3>Add New</h3>
      <EntryInput addEntry={addEntry} nameChanged={nameChanged} numberChanged={numberChanged} />
      
      <h3>Numbers</h3>
      <FilteredEntries entries={persons} filter={filter} deleteHook={deleteHook} />
    </div>
  )
}

export default App