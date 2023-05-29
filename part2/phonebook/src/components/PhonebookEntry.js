const PhonebookEntry = ({props}) => {
    return (
        <li>{props.name} {props.number}</li>
    )
}

export default PhonebookEntry