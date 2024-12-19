import { useMutation } from '@apollo/client';
import { useState } from 'react';
import useField from '../hooks/useField';
import { useNotifications } from '../hooks/useNotifications';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS_SANS_GENRES } from '../queries';

const AddBookForm = () => {
  const { successMessage, errorMessage } = useNotifications();

  const title = useField(`title`);
  const author = useField(`author`);
  const published = useField(`published`);
  const genre = useField(`genre`);

  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS_SANS_GENRES }, { query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join(`\n`);
      errorMessage(messages);
    },
    onCompleted: (response) => {
      const newBook = response.addBook;
      successMessage(
        `Added new book: ${newBook.title} by ${newBook.author.name}`
      );
      title.reset();
      author.reset();
      published.reset();
      genre.reset();
      setGenres([]);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      variables: {
        title: title.value,
        author: author.value,
        published: parseInt(published.value),
        genres,
      },
    });
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
