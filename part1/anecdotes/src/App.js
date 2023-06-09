import { useState } from 'react'

const Button = ({ clickAction, text }) => {
    return (
        <button onClick={clickAction}>
            {text}
        </button>
    )
}

const App = () => {


    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const increaseScore = (index) => {
        let copy = [...scores] //clone the array
        copy[index] += 1 //we can modify a const array because we are powerful
        setScores(copy)
    }

    const totalAnecdotes = anecdotes.length
    const getRandomAnecdoteIndex = () => {
        const index = Math.floor(Math.random() * totalAnecdotes)
        return index
    }
    const selectRandomAnecdote = () => {
        setSelected(getRandomAnecdoteIndex())
    }
    const getHighestVotedAnecdoteIndex = () => {
        const max = Math.max(...scores);
        const index = scores.indexOf(max);
        return index
    }

    const initialSelectedState = getRandomAnecdoteIndex()
    const [selected, setSelected] = useState(initialSelectedState)

    const initialScoreState = Array(totalAnecdotes).fill(0)
    const [scores, setScores] = useState(initialScoreState)

    const highestVotedAnecdoteIndex = getHighestVotedAnecdoteIndex() //i guess we can just define this once?    


    return (
        <div>
            <h1>Anecdote of the Day</h1>
            {anecdotes[selected]}
            <br></br>
            Has {scores[selected]} votes
            <br></br>
            <Button clickAction={() => increaseScore(selected)} text="Vote" />
            <Button clickAction={() => selectRandomAnecdote()} text="Next Anecdote" />
            <br></br>
            <h1>Anecdote with the Most Votes</h1>
            {anecdotes[highestVotedAnecdoteIndex]}
            <br></br>
            Has {scores[highestVotedAnecdoteIndex]} votes
        </div>
        
    )
}

export default App