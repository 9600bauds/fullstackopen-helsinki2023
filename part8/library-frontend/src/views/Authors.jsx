import { useQuery } from '@apollo/client';

import { ALL_AUTHORS } from '../queries';

import { Spinner, Table } from 'react-bootstrap';

const Authors = () => {
  const authorsQuery = useQuery(ALL_AUTHORS);

  if (authorsQuery.loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" />
      </div>
    );
  }

  const authors = authorsQuery.data.allAuthors;

  return (
    <div>
      <h2>Authors</h2>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Authors;
