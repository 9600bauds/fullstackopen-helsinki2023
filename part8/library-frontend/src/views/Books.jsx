import { Table } from 'react-bootstrap';

const Books = () => {
  const books = [];

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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Books;
