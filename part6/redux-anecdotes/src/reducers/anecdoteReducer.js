import { createSlice } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    appendAnecdotes(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
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

export const { appendAnecdotes, setAnecdotes, vote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
