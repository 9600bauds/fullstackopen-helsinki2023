import { createSlice } from "@reduxjs/toolkit";

const getId = () => (100000 * Math.random()).toFixed(0);

const contentToAnecdoteObject = (content) => {
  return {
    content,
    id: getId(),
    votes: 0,
  };
};

const initialContents = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];
const initialState = initialContents.map(contentToAnecdoteObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const newAnecdote = contentToAnecdoteObject(action.payload);
      state.push(newAnecdote); //Will immer play nice and actually let me mutate the state this time?
    },
    vote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id);
      //Use the spread operator to create a new object instead of mutating the old one
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      //Gotta do this map trickery to create a new state instead of mutating the old one.
      //Immer doesn't help here either.
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote,
      );
    },
  },
});

export const { createAnecdote, vote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
