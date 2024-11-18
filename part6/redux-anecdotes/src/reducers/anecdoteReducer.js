import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

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
      //Tell the service to update the database.
      //Ideally we would use some sort of optimistic updating here that checks the server's returned data.
      //But since the assignment didn't ask for that, we don't care too much.
      anecdoteService.update(id, changedAnecdote);
      //Gotta do this map trickery to create a new state instead of mutating the old one.
      //Immer doesn't help here either.
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote,
      );
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdotes(createdAnecdote));
  };
};

export const { appendAnecdotes, setAnecdotes, vote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
