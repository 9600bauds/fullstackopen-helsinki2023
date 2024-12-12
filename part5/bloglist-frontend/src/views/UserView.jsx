import { Link } from "react-router-dom";

const UserView = ({ user, isLoading }) => {
  if (isLoading) {
    return <div>Loading user data...</div>;
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