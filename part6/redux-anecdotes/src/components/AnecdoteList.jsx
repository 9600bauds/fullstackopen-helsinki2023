import { useDispatch, useSelector } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  //const anecdotes = useSelector((state) => state.anecdotes);
  const anecdotes = useSelector((state) => {
    if (!state.filter) {
      //If the filter is null, it is treated as no filter.
      return state.anecdotes;
    }
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.includes(state.filter),
    );
  });

  const onClickVoteButton = (id) => {
    dispatch(vote(id));
    const theAnecdote = anecdotes.find((a) => a.id === id); //Worth noting that this returns the anecdote BEFORE its votes are increased
    dispatch(showNotification(`You voted for: '${theAnecdote.content}'`));
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
          <button onClick={() => onClickVoteButton(anecdote.id)}>vote</button>
        </div>
      </div>
    ));
  }

  return <div>{drawAnecdotes(anecdotes)}</div>;
};

export default AnecdoteList;
