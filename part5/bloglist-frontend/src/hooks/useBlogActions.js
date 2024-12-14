import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from '../services/blogs';

export const useBlogActions = () => {
  const queryClient = useQueryClient();

  const updateQueryData = (updatedBlog) => {
    const oldState = queryClient.getQueryData([`blogs`]);
    const newState = oldState.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog);
    queryClient.setQueryData([`blogs`], newState);
  };



  const createBlogMutation = useMutation({
    mutationFn: (blogData) => blogService.create(blogData),
    onSuccess: (createdBlog) => {
      const oldState = queryClient.getQueryData([`blogs`]);
      const newState = oldState.concat(createdBlog); //concat is atomic, does not mutate
      queryClient.setQueryData([`blogs`], newState);
    }
  });
  const createBlog = async (newBlogData) => {
    const createdBlog = await createBlogMutation.mutateAsync(newBlogData);
    return createdBlog;
  };

  const updateBlogMutation = useMutation({
    mutationFn: ({ blogId, blogData }) => blogService.update(blogId, blogData),
    onSuccess: updateQueryData
  });
  const updateBlog = async (blogId, blogData) => {
    const updatedBlog = await updateBlogMutation.mutateAsync({ blogId, blogData });
    return updatedBlog;
  };

  const addCommentMutation = useMutation({
    mutationFn: ({ blogId, comment }) => blogService.addComment(blogId, comment),
    onSuccess: updateQueryData
  });
  const addCommentBlog = async (blogId, comment) => {
    const updatedBlog = await addCommentMutation.mutateAsync({ blogId, comment });
    return updatedBlog;
  };

  const removeBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: (id) => {
      const oldState = queryClient.getQueryData([`blogs`]);
      const newState = oldState.filter(blog => blog.id !== id);
      queryClient.setQueryData([`blogs`], newState);
    }
  });
  const removeBlog = async (id) => {
    return await removeBlogMutation.mutateAsync(id);
  };



  return { createBlog, updateBlog, removeBlog, addCommentBlog };
};