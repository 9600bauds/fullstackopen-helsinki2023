import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS_SANS_GENRES } from '../queries';
import useField from '../hooks/useField';

const AddBookForm = () => {
  const title = useField(`title`);
  const author = useField(`author`);
  const published = useField(`published`);
  const genre = useField(`genre`);

  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS_SANS_GENRES }, { query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: {
        title: title.value,
        author: author.value,
        published: parseInt(published.value),
        genres,
      },
    });

    title.reset();
    author.reset();
    published.reset();
    genre.reset();
    setGenres([]);
  };

  const addGenre = () => {
    setGenres(genres.concat(genre.value));
    genre.reset();
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input {...title.toInput()} />
        </div>
        <div>
          author
          <input {...author.toInput()} />
        </div>
        <div>
          published
          <input {...published.toInput()} type="number" />
        </div>
        <div>
          <input {...genre.toInput()} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(`, `)}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default AddBookForm;
