import { BlogPropType } from "../propTypes/Blog.propTypes";

const BlogSmall = ({ blog }) => {
  return (
    <div className='blogDiv'>
      <span className='blogTitle'>{blog.title}</span> by <span className='blogAuthor'>{blog.author}</span>
    </div>  
  );
};

BlogSmall.propTypes = {
  blog: BlogPropType.isRequired
};

const BlogList = ({ blogs, isLoading }) => {
  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if(!blogs){
    return <div>No blogs found.</div>;
  }

  return (
    <div>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <BlogSmall key={blog.id} blog={blog}/>
      )}
    </div>
  );
};
export default BlogList;