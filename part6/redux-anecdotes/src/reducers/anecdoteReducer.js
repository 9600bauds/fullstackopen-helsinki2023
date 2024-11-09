const initialContents = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const contentToAnecdoteObject = (content) => {
  return {
    content,
    id: getId(),
    votes: 0,
  };
};

const initialState = initialContents.map(contentToAnecdoteObject);

const reducer = (state = initialState, action) => {
  console.log("state now: ", state);
  console.log("action", action);
  switch (action.type) {
    case "NEW_ANECDOTE":
      return [...state, action.payload]; //todo
    case "VOTE":
      //lint gets really mad when I declare things inside a switch. Where should this go instead?
      const id = action.payload.id;
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
      //Use the spread operator to create a new object instead of mutating the old one
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      //Gotta do this map trickery to create a new state instead of mutating the old one
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote,
      );
    default:
      return state;
  }
};

export const createAnecdoteAction = (content) => {
  return {
    type: "NEW_ANECDOTE",
    payload: contentToAnecdoteObject(content),
  };
};

export const voteAction = (id) => {
  return {
    type: "VOTE",
    payload: { id },
  };
};

export default reducer;