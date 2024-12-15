import { BlogPropType } from '../propTypes/Blog.propTypes';
import { Link, useNavigate } from 'react-router-dom';
import AddCommentForm from './AddCommentForm';
import { useAuth } from '../hooks/useAuth';
import { useBlogActions } from '../hooks/useBlogActions';
import { useNotifications } from '../hooks/useNotifications';
import { Button, Card, ListGroup, Stack } from 'react-bootstrap';

const DeleteButton = ({ onDeleteButtonClicked }) => {
  return (
    <Button variant="danger" onClick={onDeleteButtonClicked} className="ms-2">
      Delete
    </Button>
  );
};

const CommentList = ({ comments }) => {
  if (!comments || !comments.length) {
    return <p>No comments</p>;
  }

  return (
    <ListGroup>
      {comments.map((comment, index) => (
        //comment-index is done to create keys that are effectively unique, since the comments don't actually have IDs...
        <ListGroup.Item key={`${comment}-${index}`}>{comment}</ListGroup.Item>
      ))}
    </ListGroup>
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
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>
          <span className='fw-bold'>{blog.title}</span> by <span className='fw-bold'>{blog.author}</span>
        </Card.Title>
        <Card.Text>
          <Link to={blog.url} className='text-decoration-none'>
            {blog.url}
          </Link>
          <Stack direction="horizontal" gap={2} className='mt-2'>
            <span>
              Likes: {blog.likes}
            </span>
            <Button onClick={onLikeButtonClicked} size="sm">
              like!
            </Button>
          </Stack>
          <div className='mt-2'>
            Submitted by&nbsp;
            <Link to={`/users/${blog.user.username}`} className='text-decoration-none fw-bold'>
              {blog.user.name}
            </Link>
          </div>
        </Card.Text>
        <div className='mt-2 d-flex align-items-center'>
          {user && user.username === blog.user.username && (
            <DeleteButton onDeleteButtonClicked={onDeleteButtonClicked} />
          )}
        </div>
      </Card.Body>
      <Card.Footer>
        <div className='mb-2'>Comments:</div>
        <CommentList comments={blog.comments} />
        <AddCommentForm onAddCommentFormSent={onAddCommentFormSent} />
      </Card.Footer>
    </Card>  
  );
};

Blog.propTypes = {
  blog: BlogPropType.isRequired,
};

export default Blog;