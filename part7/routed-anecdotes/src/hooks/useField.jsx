import { useState } from "react"

/**
 * This is a custom hook for use in input fields.
 * Since it has a type, a value, and an onChange, it can be easily used via spread operator as such:
 * 
 * const content = useField('content');
 * <input {...content} />
 */
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export default useField