import { useState } from 'react'


const StatisticsLine = ({ label, value }) => {
    return (
        <div>
            <span>{label}</span>: <span>{value}</span>
        </div>
        )
}


const Button = ({ clickAction, text }) => {
    return (
        <button onClick={clickAction}>
            {text}
        </button>
        )
}

const Statistics = ({ good, neutral, bad }) => {
    const getTotal = () => {
        return good + neutral + bad
    }
    const getScore = () => {
        return good * 1 + neutral * 0 + bad * -1 //Lazily done in this way so you can change the values later if needed
    }
    const getAverage = () => {
        const average = (getScore() / getTotal())
        return average || "0" //Coalescing operator: show 0 in case of NaN
    }
    const positivePercent = () => {
        const posPercent = good / getTotal() * 100;
        return (posPercent || "0") + "%" //Coalescing operator in case of NaN
    }

    if (getTotal() === 0) {
        return <div>No feedback given!</div>
    }

    return (
        <div>
            <StatisticsLine label="Good" value={good} />
            <StatisticsLine label="Neutral" value={neutral} />
            <StatisticsLine label="Bad"  value={bad} />
            <br></br>
            <StatisticsLine label="Total" value={getTotal()} />
            <StatisticsLine label="Average" value={getAverage()} />
            <StatisticsLine label="Positive%" value={positivePercent()} />
        </div>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const increaseGood = (amt) => {
        const updatedGood = good + amt
        setGood(updatedGood)
    }
    const increaseNeutral = (amt) => {
        const updatedNeutral = neutral + amt
        setNeutral(updatedNeutral)
    }
    const increaseBad = (amt) => {
        const updatedBad = bad + amt
        setBad(updatedBad)
    }

    return (
        <div>
            <h1>Give Feedback</h1>

            <Button clickAction={() => increaseGood(1)} text="Good" />
            <Button clickAction={() => increaseNeutral(1)} text="Neutral" />
            <Button clickAction={() => increaseBad(1)} text="Bad" />

            <h1>Statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App