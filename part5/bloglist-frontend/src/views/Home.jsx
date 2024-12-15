import { useQuery } from "@tanstack/react-query";
import AddBlogForm from "../components/AddBlogForm";
import BlogList from "../components/BlogList";
import Togglable from "../components/Togglable";
import blogService from '../services/blogs';

const Home = () => {
  const {data: blogs, isLoading} = useQuery({
    queryKey: [`blogs`],
    queryFn: blogService.getAll
  });

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