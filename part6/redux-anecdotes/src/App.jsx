import { useSelector, useDispatch } from "react-redux";
import { createAnecdoteAction, voteAction } from "./reducers/anecdoteReducer";

const App = () => {
  const anecdotes = useSelector((state) => state);
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAction(id));
  };

  const submitNote = (event) => {
    event.preventDefault(); //Do not refresh, do not pass go, do not collect 200$
    const content = event.target.content.value;
    event.target.content.value = ""; //Clear the text from the field input
    dispatch(createAnecdoteAction(content));
  };

  //Rather than try to make sure the store's state is always sorted, I only sort them visually here.
  //The exercise did not specify, so I believe this is acceptable, unless we need them to be sorted in the store for some reason
  function drawAnecdotes(anecdotes) {
    // Create a new sorted array instead of mutating the store's state, which is no bueno
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

    return sortedAnecdotes.map((anecdote) => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {drawAnecdotes(anecdotes)}
      <h2>create new</h2>
      <form onSubmit={submitNote}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
