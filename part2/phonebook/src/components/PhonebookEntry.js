import React from "react"

const PhonebookEntry = ({props, deleter}) => {
    return (
        <li className='phonebookEntry'>{props.name} {props.number} <button onClick={deleter}>Delete</button></li>
    )
}

export default PhonebookEntry