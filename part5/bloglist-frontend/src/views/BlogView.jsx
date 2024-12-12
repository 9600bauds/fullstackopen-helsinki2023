import Blog from "../components/Blog";

const BlogView = ({ blog, isLoading, addLike, deleteBlog }) => {
  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if(!blog){
    return <div>Blog not found.</div>;
  }

  return (
    <Blog blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
  );
};
export default BlogView;