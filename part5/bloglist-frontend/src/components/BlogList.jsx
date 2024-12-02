import Blog from "./Blog";

const BlogList = ({blogQuery, user, addLike, deleteBlog}) => {
  if(blogQuery.loading){
    return <div>Loading...</div>;
  }
  return (
    <div>
      {blogQuery.data.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog}/>
      )}
    </div>

  );
};
export default BlogList;