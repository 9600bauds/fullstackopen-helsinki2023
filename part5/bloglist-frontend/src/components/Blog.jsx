import { BlogPropType } from '../propTypes/Blog.propTypes';
import { Link, useNavigate } from 'react-router-dom';
import AddCommentForm from './AddCommentForm';
import { useAuth } from '../hooks/useAuth';
import { useBlogActions } from '../hooks/useBlogActions';
import { useNotifications } from '../hooks/useNotifications';

const DeleteButton = ({ onDeleteButtonClicked }) => {
  return (
    <button className='blogDeleteButton' onClick = {onDeleteButtonClicked}>
      Delete
    </button>
  );
};

const CommentList = ({ comments }) => {
  if (!comments || !comments.length)
  {
    return (`no comments`);
  }

  return (
    <ul>
      {
      //comment-index is done to create keys that are effectively unique, since the comments don't actually have IDs...
        comments.map((comment, index) => <li key={`${comment}-${index}`}>{comment}</li>)
      }
    </ul>
  );
};

const Blog = ({ blog }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateBlog, removeBlog, addCommentBlog } = useBlogActions();
  const { successMessage, errorMessage } = useNotifications();

  const onAddCommentFormSent = async (comment) => {
    try{
      await addCommentBlog(blog.id, comment);
      successMessage(`Added comment: ${comment}`);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const onLikeButtonClicked = async () => {
    try{
      let newBlogObject = { ...blog }; //This creates a clone
      newBlogObject.likes++;
      const updatedBlog = await updateBlog(blog.id, newBlogObject);
      successMessage(`You liked: ${updatedBlog.title} by ${updatedBlog.author}!`);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const onDeleteButtonClicked = async () => {
    if (!window.confirm(`Really delete blog: ${blog.title} by ${blog.author}?`)) {
      return;
    }

    try{
      await removeBlog(blog.id);
      navigate(-1);
      successMessage(`Blog deleted!`);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }    
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
      {user && user.username === blog.user.username && <DeleteButton onDeleteButtonClicked={onDeleteButtonClicked}/>}
      <div className='blogComments'>
        <div>comments:</div>
        <CommentList comments={blog.comments}/>
      </div>
      <AddCommentForm onAddCommentFormSent={onAddCommentFormSent} />
    </div>  
  );
};

Blog.propTypes = {
  blog: BlogPropType.isRequired,
};

export default Blog;