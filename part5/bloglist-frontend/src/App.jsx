import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import BlogList from './components/BlogList';
import Togglable from './components/Togglable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const App = () => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const blogQuery = useQuery({
    queryKey: [`blogs`],
    queryFn: async () => {
      const fetchedBlogs = await blogService.getAll();
      // We sort the blogs here, though perhaps we should be sorting them only visually in the bloglist element?
      return fetchedBlogs.sort((a, b) => b.likes - a.likes);
    }
  });

  const createBlogMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),
    onSuccess: () => {
      // Invalidate and refetch ALL the blogs!! optimization pending.
      queryClient.invalidateQueries([`blogs`]);
    }
  });
  const createBlog = async (newBlogData) => {
    const createdBlog = await createBlogMutation.mutateAsync(newBlogData);
    return createdBlog;
  };

  const successMessage = (msg) => toast.success(msg);
  const errorMessage = (msg) => toast.error(msg,  {
    duration: 6000,
  });

  const findBlogFromID = (id) => {
    return blogQuery.data.find(b => b.id === id);
  };
  //todo: this is broken, fix to use react query logic
  const updateBlogFromID = (id, newBlog) => {
    setBlogs(blogQuery.data.map(blog => blog.id !== id ? blog : newBlog));
  };
  //todo: this is broken, fix to use react query logic
  const removeBlogFromID = (id) => {
    setBlogs(blogQuery.data.filter(blog => blog.id !== id));
  };


  const addLike = async (blogId) => {
    try{
      const theBlog = findBlogFromID(blogId);
      let newBlogObject = { ...theBlog };
      newBlogObject.likes++;
      const promise = blogService.update(blogId, newBlogObject);
      const response = await promise;
      updateBlogFromID(blogId, response);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const deleteBlog = async (blogId) => {   
    try{
      await blogService.remove(blogId);
      removeBlogFromID(blogId,);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }    
  };

  const handleLogin = async (username, password) => {
    try{
      const user = await loginService.login({
        username, password,
      });
      onSuccessfulLogin(user);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const onSuccessfulLogin = (user) => {
    setUser(user);
    blogService.setToken(user.token);
    window.localStorage.setItem(
      `blogAppUser`, JSON.stringify(user)
    ); 
  };

  const logOut = () => {
    setUser(null);
    window.localStorage.removeItem(`blogAppUser`);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(`blogAppUser`);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      onSuccessfulLogin(user);
    }
  }, []);

  if (user === null) {
    return (
      <>
        <div><Toaster/></div>
        <div>
          <h2>Log in to continue</h2>
          <LoginForm
            handleLogin={handleLogin}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div><Toaster/></div>
      <div>
        <div data-testid='welcome-msg'>
          Welcome {user.name}! If that isn&apos;t you, <button data-testid='logout-btn' onClick={logOut}>log out</button>
        </div>
        <hr/>
        <Togglable buttonLabel="add new blog">
          <h2>Create New Blog</h2>
          <AddBlogForm
            successMessage={successMessage}
            errorMessage={errorMessage}
            createBlog={createBlog}
          />
        </Togglable>
        <h2>All Blogs</h2>
        <BlogList
          blogQuery={blogQuery}
          user={user}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      </div>
    </>
  );
};

export default App;