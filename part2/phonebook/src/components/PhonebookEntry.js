import React from "react"

const PhonebookEntry = ({props, deleter}) => {
    return (
        <li>{props.name} {props.number} <button onClick={deleter}>Delete</button></li>
    )
}

export default PhonebookEntry