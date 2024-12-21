import { useQuery, useSubscription } from '@apollo/client';

import { ALL_BOOKS_SANS_GENRES, BOOK_ADDED } from '../queries';

import { Spinner } from 'react-bootstrap';
import { useState } from 'react';
import GenreButtons from '../components/GenreButtons';
import BookTable from '../components/BookTable';

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const booksQuery = useQuery(ALL_BOOKS_SANS_GENRES, {
    variables: { genre: selectedGenre },
  });
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded;

      const cachedBooks = client.cache.readQuery({
        query: ALL_BOOKS_SANS_GENRES,
        variables: { genre: selectedGenre },
      });
      if (cachedBooks) {
        client.cache.writeQuery({
          query: ALL_BOOKS_SANS_GENRES,
          variables: { genre: selectedGenre },
          data: { allBooks: [...cachedBooks.allBooks, newBook] },
        });
      }
    },
  });

  if (booksQuery.loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" />
      </div>
    );
  }

  const books = booksQuery.data.allBooks;

  return (
    <div>
      <h2>Books</h2>

      <BookTable books={books} />
      <GenreButtons
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
    </div>
  );
};

export default Books;
