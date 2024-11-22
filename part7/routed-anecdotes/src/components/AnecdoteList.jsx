import { Link } from "react-router-dom";

export const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => {
        const thisURL = `/anecdotes/${anecdote.id}`
        return (
        <li key={anecdote.id}>
          <Link to={thisURL}>{anecdote.content}</Link>
        </li>
        )
      })}
    </ul>
  </div>
);
