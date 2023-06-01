import React from "react"
import PhonebookEntry from "./PhonebookEntry"

const FilteredEntries = ({entries, filter, deleteHook}) => {
    function containsSubstringIgnoreCase(stringA, stringB) {
        const lowerCaseStringA = stringA.toLowerCase()
        const lowerCaseStringB = stringB
        return lowerCaseStringA.includes(lowerCaseStringB)
    }

    const filteredEntries = typeof filter !== 'string' 
        ? entries 
        : entries.filter((entry) =>
            containsSubstringIgnoreCase(entry.name, filter)
        )

    return (
        <div>
        {filteredEntries.map(person =>
            <PhonebookEntry key={person.id} props={person} deleter={() => deleteHook(person.id)} />
          )}
        </div>
    )
}

export default FilteredEntries