import AddBlogForm from "../components/AddBlogForm";
import BlogList from "../components/BlogList";
import Togglable from "../components/Togglable";

const Home = ({ blogs, isLoading }) => {
  return (
    <div>
      <Togglable buttonLabel="Create New Blog">
        <h2>Create New Blog</h2>
        <AddBlogForm />
      </Togglable>
      <h2>All Blogs</h2>
      <BlogList
        blogs={blogs}
        loading={isLoading}
      />
    </div>
  );
};
export default Home;