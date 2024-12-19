import { useQuery } from '@apollo/client';

import { ALL_BOOKS_SANS_GENRES } from '../queries';

import { Spinner, Table } from 'react-bootstrap';

const Books = () => {
  const booksQuery = useQuery(ALL_BOOKS_SANS_GENRES);

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

      <Table bordered hover responsive>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
