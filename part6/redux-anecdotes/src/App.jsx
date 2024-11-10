import NewAnecdoteForm from "./components/NewAnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterInput from "./components/FilterInput";
import Notification from "./components/Notification";

const App = () => {
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
