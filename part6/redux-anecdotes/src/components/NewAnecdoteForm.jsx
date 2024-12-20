import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

const NewAnecdoteForm = () => {
  const dispatch = useDispatch();

  const submitAnecdote = async (event) => {
    event.preventDefault(); //Do not refresh, do not pass go, do not collect 200$
    const content = event.target.content.value;
    if (!content) return; //Show some message + more validation here?
    event.target.content.value = ""; //Clear the text from the field input

    dispatch(createAnecdote(content));
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={submitAnecdote}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default NewAnecdoteForm;
