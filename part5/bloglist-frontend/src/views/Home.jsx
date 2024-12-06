import AddBlogForm from "../components/AddBlogForm";
import BlogList from "../components/BlogList";
import Togglable from "../components/Togglable";

const Home = ({ blogs, isLoading, successMessage, errorMessage, addLike, createBlog, deleteBlog }) => {
  return (
    <div>
      <Togglable buttonLabel="Create New Blog">
        <h2>Create New Blog</h2>
        <AddBlogForm
          successMessage={successMessage}
          errorMessage={errorMessage}
          createBlog={createBlog}
        />
      </Togglable>
      <h2>All Blogs</h2>
      <BlogList
        blogs={blogs}
        loading={isLoading}
        addLike={addLike}
        deleteBlog={deleteBlog}
      />
    </div>
  );
};
export default Home;