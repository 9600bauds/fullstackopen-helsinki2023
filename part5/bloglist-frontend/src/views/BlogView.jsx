import Blog from "../components/Blog";

const BlogView = ({ blog, isLoading }) => {
  if (isLoading) {
    return <div>Loading blogs...</div>;
  }

  if(!blog){
    return <div>Blog not found.</div>;
  }

  return (
    <Blog blog={blog} />
  );
};
export default BlogView;