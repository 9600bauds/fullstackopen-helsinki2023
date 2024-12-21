import { useMutation } from '@apollo/client';
import { useState } from 'react';
import useField from '../hooks/useField';
import { useNotifications } from '../hooks/useNotifications';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS_SANS_GENRES } from '../queries';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AddBookForm = () => {
  const { successMessage, errorMessage } = useNotifications();

  const title = useField(`title`);
  const author = useField(`author`);
  const published = useField(`published`);
  const genre = useField(`genre`);

  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
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
    update: (cache, response) => {
      const newBook = response.data?.addBook;
      if (!newBook) {
        return;
      }

      const cachedBooks = cache.readQuery({ query: ALL_BOOKS_SANS_GENRES });
      if (cachedBooks) {
        cache.writeQuery({
          query: ALL_BOOKS_SANS_GENRES,
          data: { allBooks: [...cachedBooks.allBooks, newBook] },
        });
      }

      // Behold, the hidden complexity: This MIGHT have created a new author!!
      const newBookAuthor = newBook.author;
      const cachedAuthors = cache.readQuery({ query: ALL_AUTHORS });
      if (cachedAuthors) {
        const authorExists = cachedAuthors.allAuthors.find(
          (author) => author.id === newBookAuthor.id
        );
        if (!authorExists) {
          cache.writeQuery({
            query: ALL_AUTHORS,
            data: { allAuthors: [...cachedAuthors.allAuthors, newBookAuthor] }, //Need to make sure this query returns ALL necessary data for the author
          });
        }
      }
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

  const token = localStorage.getItem(`libraryToken`);
  if (!token) {
    return (
      <div>
        <Alert>
          You must be <Link to="/login">logged in</Link> to add a book.
        </Alert>
      </div>
    );
  }

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
