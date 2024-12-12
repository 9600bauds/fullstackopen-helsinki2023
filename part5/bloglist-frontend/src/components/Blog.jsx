import PropTypes from 'prop-types';
import { BlogPropType } from '../propTypes/Blog.propTypes';
import { useUserContext } from '../contexts/userContext';
import { Link } from 'react-router-dom';

const Blog = ({ blog, addLike, deleteBlog }) => {
  const user = useUserContext();

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

  return (
    <div className='blogDiv'>
      <span className='blogTitle'>{blog.title}</span> by <span className='blogAuthor'>{blog.author}</span>
      <div className='blogUrl'>
        <Link to={blog.url}>
          {blog.url}
        </Link>
      </div>
      <div className='blogLikes'>
        Likes: <span className='likesAmount'>{blog.likes}</span> <button className='likeButton' onClick={onLikeButtonClicked}>like!</button>
      </div>
      <div className='blogSubmittedBy'>
        submitted by&nbsp;
        <span className='submittedByName'>
          <Link to={`/users/${blog.user.username}`}>
            {blog.user.name}
          </Link>
        </span>
      </div>
      {user && user.username === blog.user.username && generateDeleteButton()}
      <div className='blogComments'>
        <div>comments:</div>
        {!blog.comments || !blog.comments.length ? `no comments` : 
          <ul>
            {
              // eslint-disable-next-line react/jsx-key
              blog.comments.map(comment => <li>{comment}</li>)
            }
          </ul>
        }
      </div>
    </div>  
  );
};

Blog.propTypes = {
  blog: BlogPropType.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
};

export default Blog;