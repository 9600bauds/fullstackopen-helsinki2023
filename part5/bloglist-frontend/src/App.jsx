import { useEffect, useContext } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import { useQuery } from '@tanstack/react-query';
import userContext from './contexts/userContext';
import Notification from './components/Notification';
import { useNotificationDispatch } from './contexts/notificationContext';
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import UsersView from './views/UsersView';
import LoginView from './views/LoginView';
import { Container } from 'react-bootstrap';
import { useBlogActions } from './hooks/useBlogActions';
import UserView from './views/UserView';
import BlogView from './views/BlogView';
import './App.css';
import Navmenu from './components/Navmenu';

const App = () => {
  const navigate = useNavigate();

  const blogQuery = useQuery({
    queryKey: [`blogs`],
    queryFn: blogService.getAll
  });
  const { createBlog, updateBlog, removeBlog } = useBlogActions();

  const blogMatch = useMatch(`/blogs/:id`);
  const specificblog = blogMatch && blogQuery.isFetched ? blogQuery.data.find(blog => blog.id === blogMatch.params.id) : null;

  const usersQuery = useQuery({
    queryKey: [`users`],
    queryFn: userService.getAll
  });

  const userMatch = useMatch(`/users/:username`);
  const specificUser = userMatch && usersQuery.isFetched ? usersQuery.data.find(user => user.username === userMatch.params.username) : null;
  
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
      const theBlog = blogQuery.data.find(blog => blog.id === blogId);
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
      removeBlog(blogId);
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
    navigate(`/login`);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(`blogAppUser`);
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      onSuccessfulLogin(loggedUser);
    }
    else{
      navigate(`/login`);
    }
  }, []);

  return (
    <Container>
      <Navmenu logOut={logOut} />
      <Notification />
      <Routes>
        <Route path="/" 
          element={
            <Home 
              blogs = {blogQuery.data}
              isLoading = {blogQuery.isLoading}
              successMessage={successMessage}
              errorMessage={errorMessage}
              addLike={addLike}
              createBlog={createBlog}
              deleteBlog={deleteBlog} />
          }
        />
        <Route path="/blogs/:id" element={<BlogView blog={specificblog} isLoading={blogQuery.isLoading} addLike={addLike} deleteBlog={deleteBlog} />} />
        <Route path="/login" element={<LoginView handleLogin={handleLogin} />} />
        <Route path="/users" element={<UsersView users={usersQuery.data} isLoading={usersQuery.isLoading}/>} />
        <Route path="/users/:username" element={<UserView user={specificUser} isLoading={usersQuery.isLoading}/>} />
      </Routes>
    </Container>
  );
};

export default App;