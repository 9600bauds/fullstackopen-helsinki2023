import { useQuery } from '@apollo/client';

import { ALL_BOOKS_SANS_GENRES, LITERALLY_ME } from '../queries';

import { Alert, Spinner } from 'react-bootstrap';
import BookTable from '../components/BookTable';
import { Link } from 'react-router-dom';

const Recommended = () => {
  const token = localStorage.getItem(`libraryToken`);

  const userQuery = useQuery(LITERALLY_ME, {
    skip: !token,
  });
  const favoriteGenre = userQuery.data?.me?.favoriteGenre;

  const booksQuery = useQuery(ALL_BOOKS_SANS_GENRES, {
    variables: { genre: favoriteGenre },
    skip: !token || !favoriteGenre,
  });

  if (!token) {
    return (
      <div>
        <Alert>
          You must be <Link to="/login">logged in</Link> get book
          recommendations.
        </Alert>
      </div>
    );
  }
  if (userQuery.loading || booksQuery.loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" />
      </div>
    );
  }

  const books = booksQuery.data.allBooks;
  if (!books.length) {
    return (
      <Alert>
        No books found matching your favorite genre ({favoriteGenre}). Sorry,
        you can&apos;t change it either. You didn&apos;t even get to pick it,
        truthfully. It&apos;s just how it is.
      </Alert>
    );
  }
  return (
    <div>
      <h2>Here are some {favoriteGenre} books:</h2>
      <BookTable books={books} />
    </div>
  );
};

export default Recommended;
