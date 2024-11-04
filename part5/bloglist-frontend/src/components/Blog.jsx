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
      <button className='blogDeleteButton' onClick = {onDeleteButtonClicked}>
        Delete
      </button>
    );
  };

  if(!expanded){
    return (
      <div className='blogDiv' style={blogStyle}>
        <span className='blogTitle'>{blog.title}</span> by <span className='blogAuthor'>{blog.author}</span>
        <button className='toggleButton' onClick={toggleExpanded}>view</button>
      </div>  
    );
  }
  return (
    <div className='blogDiv expanded' style={blogStyle}>
      <span className='blogTitle'>{blog.title}</span> by <span className='blogAuthor'>{blog.author}</span>
      <button className='toggleButton' onClick={toggleExpanded}>hide</button>
      <div className='blogUrl'>
        {blog.url}
      </div>
      <div className='blogLikes'>
        Likes: <span className='likesAmount'>{blog.likes}</span> <button className='likeButton' onClick={onLikeButtonClicked}>like!</button>
      </div>
      <div className='blogSubmittedBy'>
        submitted by <span className='submittedByName'>{blog.user.name}</span>
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