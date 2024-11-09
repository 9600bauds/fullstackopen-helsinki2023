import { useDispatch, useSelector } from "react-redux";
import { voteAction } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  //const anecdotes = useSelector((state) => state.anecdotes);
  const anecdotes = useSelector((state) => {
    if (state.filter === "ALL") {
      return state.anecdotes;
    }
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.includes(state.filter),
    );
  });

  const vote = (id) => {
    dispatch(voteAction(id));
  };

  //Rather than try to make sure the store's state is always sorted, I only sort them visually here.
  //The exercise did not specify, so I believe this is acceptable, unless we need them to be sorted in the store for some reason
  function drawAnecdotes(anecdotes) {
    if (!anecdotes.length) {
      return "No anecdotes found.";
    }
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

  return <div>{drawAnecdotes(anecdotes)}</div>;
};

export default AnecdoteList;
