import { useEffect, useContext } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import BlogList from './components/BlogList';
import Togglable from './components/Togglable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userContext from './contexts/userContext';
import Notification from './components/Notification';
import { useNotificationDispatch } from './contexts/notificationContext';

const App = () => {
  const queryClient = useQueryClient();

  const blogQuery = useQuery({
    queryKey: [`blogs`],
    queryFn: blogService.getAll
  });
  
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
    mutationFn: (blogData) => blogService.update(blogData.id, blogData),
    onSuccess: (updatedBlog) => {
      const oldState = queryClient.getQueryData([`blogs`]);
      const newState = oldState.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog);
      queryClient.setQueryData([`blogs`], newState);
    }
  });
  const updateBlog = async (updatedBlogData) => {
    const updatedBlog = await updateBlogMutation.mutateAsync(updatedBlogData);
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
  const removeBlogFromID = async (id) => {
    return await removeBlogMutation.mutateAsync(id);
  };
  
  const findBlogFromID = (id) => {
    return blogQuery.data.find(blog => blog.id === id);
  };

  const [user, userDispatch] = useContext(userContext);
  const notificationDispatch = useNotificationDispatch();
  
  const showNotification = (message, seconds=5, type=`success`) => {
    notificationDispatch({ type: `SET`, payload: {message, type} });

    // Effectively refresh the timer if a notification already existed
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }

    window.notificationTimeout = setTimeout(() => {
      notificationDispatch({ type: `CLEAR` });
    }, seconds * 1000);
  };
  
  const successMessage = (msg) => {
    showNotification(msg);
  };
  const errorMessage = (msg) => {
    showNotification(msg, 6, `error`);
  };

  const addLike = async (blogId) => {
    try{
      const theBlog = findBlogFromID(blogId);
      let newBlogObject = { ...theBlog }; //This creates a clone
      newBlogObject.likes++;
      updateBlog(newBlogObject);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const deleteBlog = async (blogId) => {   
    try{
      removeBlogFromID(blogId);
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
    userDispatch({ type: `SET`, payload: user });
    blogService.setToken(user.token);
    window.localStorage.setItem(
      `blogAppUser`, JSON.stringify(user)
    ); 
  };

  const logOut = () => {
    userDispatch({ type: `CLEAR` });
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
        <div>
          <Notification />
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
      <div>
        <div data-testid='welcome-msg'>
          Welcome {user.name}! If that isn&apos;t you, <button data-testid='logout-btn' onClick={logOut}>log out</button>
        </div>
        <hr/>
        <Notification />
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
          blogs={blogQuery.data}
          loading={blogQuery.isLoading}
          addLike={addLike}
          deleteBlog={deleteBlog}
        />
      </div>
    </>
  );
};

export default App;