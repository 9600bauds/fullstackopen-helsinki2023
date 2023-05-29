import React from "react";

const EntryInput = ({addEntry, nameChanged, numberChanged}) => {
    return (
        <div>
            <form onSubmit={addEntry}>
                <div>
                Name: <input onChange={nameChanged} />
                </div>
                <div>
                Number: <input onChange={numberChanged} />
                </div>
                <div>
                <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

export default EntryInput