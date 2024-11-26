import useField from "../hooks/useField";

export const NewAnecdoteForm = ({ addNew }) => {
  const content = useField('content');
  const author = useField('author');
  const info = useField('info');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
  };

  const reset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.toInput()} />
        </div>
        <div>
          author
          <input {...author.toInput()} />
        </div>
        <div>
          url for more info
          <input {...info.toInput()} />
        </div>
        <button>create</button>
      </form>
      <button onClick={() => reset()}>reset</button>
    </div>
  );

};
