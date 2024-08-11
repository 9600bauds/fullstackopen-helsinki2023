import { useState } from 'react';

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: `solid`,
    borderWidth: 1,
    marginBottom: 5
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if(!expanded){
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleExpanded}>view</button>
      </div>  
    );
  }
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleExpanded}>hide</button>
      <div>
        {blog.url}
      </div>
      <div>
        Likes: {blog.likes} <button>like!</button>
      </div>
      <div>
        submitted by {blog.user.name}
      </div>
    </div>  
  );
};

export default Blog;