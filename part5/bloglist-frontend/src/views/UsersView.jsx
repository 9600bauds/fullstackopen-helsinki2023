import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const UsersView = ({ users, isLoading }) => {
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if(!users){
    return <div>No users found.</div>;
  }

  return (
    <Table size="sm">
      <thead>
        <tr>
          <th>username</th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => 
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.username}`}>
                {user.name}
              </Link>
            </td>
            <td>
              {user.blogs.length}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
export default UsersView;