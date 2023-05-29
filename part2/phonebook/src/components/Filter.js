import React from "react";

const Filter = ({filterChanged}) => {

    return (
        <div>
            Filter by name: <input onChange={filterChanged} />
        </div>
    )
}

export default Filter