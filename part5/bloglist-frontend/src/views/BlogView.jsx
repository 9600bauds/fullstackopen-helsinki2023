import { useQuery, useQueryClient } from "@tanstack/react-query";
import Blog from "../components/Blog";
import { useParams } from "react-router-dom";
import blogService from '../services/blogs';

const BlogView = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {data: blog, isLoading} = useQuery({
    queryKey: [`blogs`, id],
    queryFn: () => blogService.getOne(id),
    initialData: () => {
      const cachedBlogs = queryClient.getQueryData([`blogs`]);
      return cachedBlogs?.find(blog => blog.id === id);
    }
  });

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