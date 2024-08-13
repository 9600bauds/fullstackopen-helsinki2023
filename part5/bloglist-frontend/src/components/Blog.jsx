import { useState } from 'react';
import PropTypes from 'prop-types';
import { BlogPropType } from '../propTypes/Blog.propTypes';
import { UserPropType } from '../propTypes/User.propTypes';

const Blog = ({ blog, user, addLike, deleteBlog }) => {
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

  const onLikeButtonClicked = () => {
    addLike(blog.id);
  };

  const onDeleteButtonClicked = () => {
    if (!window.confirm(`Really delete blog: ${blog.title} by ${blog.author}?`)) {
      return;
    }
    deleteBlog(blog.id);
  };

  const generateDeleteButton = () => {
    return(
      <button onClick = {onDeleteButtonClicked}>
        Delete
      </button>
    );
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
        Likes: {blog.likes} <button onClick={onLikeButtonClicked}>like!</button>
      </div>
      <div>
        submitted by {blog.user.name}
      </div>
      {user.username === blog.user.username && generateDeleteButton()}
    </div>  
  );
};

Blog.propTypes = {
  blog: BlogPropType.isRequired,
  user: UserPropType.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
};

export default Blog;