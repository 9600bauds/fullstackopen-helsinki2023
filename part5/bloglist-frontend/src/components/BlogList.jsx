import Blog from "./Blog";

const BlogList = ({blogs, isLoading, addLike, deleteBlog}) => {
  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if(!blogs){
    return <div>No blogs found.</div>;
  }

  return (
    <div>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog}/>
      )}
    </div>
  );
};
export default BlogList;