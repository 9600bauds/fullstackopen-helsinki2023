import React from "react"

const NameInput = ({textInput, setTextInput}) => {
 
    const handleChange = (event) => {
        const newValue = event.target.value;
        setTextInput(newValue);
      };

    return (
        <input value={textInput} onChange={handleChange} />
    )
  }

export default NameInput