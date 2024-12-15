import { Link } from "react-router-dom";
import { BlogPropType } from "../propTypes/Blog.propTypes";
import { Card, ListGroup } from "react-bootstrap";

const BlogSmall = ({ blog }) => {
  return (
    <ListGroup.Item>
      <Link to={`/blogs/${blog.id}`} className='text-decoration-none'>
        <span className='fw-bold'>{blog.title}</span> <span className='text-muted'>by {blog.author}</span>
      </Link>
    </ListGroup.Item>
  );
};
BlogSmall.propTypes = {
  blog: BlogPropType.isRequired
};

const BlogList = ({ blogs, isLoading }) => {
  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if (!blogs) {
    return <div>No blogs found.</div>;
  }

  return (
    <Card>
      <ListGroup variant="flush">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <BlogSmall key={blog.id} blog={blog} />
          ))}
      </ListGroup>
    </Card>
  );
};
export default BlogList;