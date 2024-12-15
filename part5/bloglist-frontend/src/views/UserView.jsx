import { Link, useParams } from "react-router-dom";
import userService from '../services/users';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";

const UserView = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const {data: user, isLoading} = useQuery({
    queryKey: [`users`, username],
    queryFn: () => userService.getOne(username),
    initialData: () => {
      const cachedUsers = queryClient.getQueryData([`users`]);
      return cachedUsers?.find(user => user.username === username);
    }
  });

  if (isLoading) {
    return(
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" />
      </div>
    );
  }

  if(!user){
    return <div>Could not find that user.</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>

      <h3>Added blogs:</h3>
      {
        user.blogs.length === 0 ?
          `No blogs found.` : 
          user.blogs.map(blog => <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>)
      }
    </div>
  );
};
export default UserView;