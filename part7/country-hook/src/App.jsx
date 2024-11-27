import { useState } from 'react'
import useField from './hooks/useField'
import { useCountry } from './hooks/useCountry'
import { Country } from './components/Country'

const App = () => {
  const nameInput = useField('name')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const searchSubmitted = (e) => {
    e.preventDefault()
    setName(nameInput.value) // Changing this will fire fetch() in the useCountry hook. Seems like a very non-explicit way of doing it though?
  }

  return (
    <div>
      <form onSubmit={searchSubmitted}>
        <input {...nameInput.toInput()} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App