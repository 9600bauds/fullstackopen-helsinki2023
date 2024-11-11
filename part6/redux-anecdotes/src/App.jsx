import { useEffect } from "react";

import NewAnecdoteForm from "./components/NewAnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterInput from "./components/FilterInput";
import Notification from "./components/Notification";

import { initializeAnecdotes } from "./reducers/anecdoteReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAnecdotes());
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
