import {
  Link
} from 'react-router-dom'

export const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has <span>{anecdote.votes}</span> votes</div>
      <div>for more info see: <Link to={anecdote.info}>{anecdote.info}</Link></div> {/* Probably an overuse/misuse of react route's Link component? Probably should use <a></a>*/}
      <br></br>
      <div><Link to='/'>back</Link></div>
    </div>
  )
}