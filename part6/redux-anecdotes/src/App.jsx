import NewAnecdoteForm from "./components/NewAnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterInput from "./components/FilterInput";

const App = () => {
  return (
    <div>
      <FilterInput />
      <AnecdoteList />
      <NewAnecdoteForm />
    </div>
  );
};

export default App;
