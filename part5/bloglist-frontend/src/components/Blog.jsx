import Togglable from './Togglable';

const Blog = ({ blog }) => (
    <div>
        {blog.title}
        <Togglable openLabel='view' closeLabel ='close'>
            <div>{blog.url}</div>
            <div>{blog.likes}<button>like</button></div>
            <div>{blog.author.name}</div>
        </Togglable>
    </div>  
);
  
export default Blog;