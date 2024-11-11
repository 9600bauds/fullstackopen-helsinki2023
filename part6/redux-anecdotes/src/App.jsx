import { useEffect } from "react";

import NewAnecdoteForm from "./components/NewAnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterInput from "./components/FilterInput";
import Notification from "./components/Notification";

import anecdoteService from "./services/anecdotes";
import { setAnecdotes } from "./reducers/anecdoteReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    anecdoteService.getAll().then((notes) => dispatch(setAnecdotes(notes)));
  }, []);

  return (
    <div>
      <FilterInput />
      <Notification />
      <AnecdoteList />
      <NewAnecdoteForm />
    </div>
  );
};

export default App;
