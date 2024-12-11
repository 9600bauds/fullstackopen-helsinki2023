import { useParams } from "react-router-dom";

const UserView = ({ users, isLoading }) => {
  const username = useParams().username;

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if(!users){
    return <div>No users found.</div>;
  }

  const user = users.find(u => u.username === username);

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
          user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)
      }
    </div>
  );
};
export default UserView;