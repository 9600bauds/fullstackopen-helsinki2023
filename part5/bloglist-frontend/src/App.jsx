import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Route, Routes, useMatch } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

import Navmenu from './components/Navmenu';
import Notification from './components/Notification';

import Home from './views/Home';
import UsersView from './views/UsersView';
import LoginView from './views/LoginView';
import UserView from './views/UserView';
import BlogView from './views/BlogView';
import blogService from './services/blogs';
import userService from './services/users';

import './App.css';
import { Container } from 'react-bootstrap';

const App = () => {
  const { user, checkForSavedCredentials } = useAuth();

  const blogQuery = useQuery({
    queryKey: [`blogs`],
    queryFn: blogService.getAll
  });

  const blogMatch = useMatch(`/blogs/:id`);
  const specificblog = blogMatch && blogQuery.isFetched ? blogQuery.data.find(blog => blog.id === blogMatch.params.id) : null;

  const usersQuery = useQuery({
    queryKey: [`users`],
    queryFn: userService.getAll
  });

  const userMatch = useMatch(`/users/:username`);
  const specificUser = userMatch && usersQuery.isFetched ? usersQuery.data.find(user => user.username === userMatch.params.username) : null;


  useEffect(() => {
    checkForSavedCredentials(); // Explicitly check this once when App mounts
  }, [checkForSavedCredentials]);

  if(!user){
    return (
      <Container>
        <Notification />
        <LoginView />
      </Container>
    );
  }

  return (
    <Container>
      <Navmenu />
      <Notification />
      <Routes>
        <Route path="/" 
          element={
            <Home 
              blogs = {blogQuery.data}
              isLoading = {blogQuery.isLoading}
            />
          }
        />
        <Route path="/blogs/:id" element={<BlogView blog={specificblog} isLoading={blogQuery.isLoading} />} />
        <Route path="/users" element={<UsersView users={usersQuery.data} isLoading={usersQuery.isLoading}/>} />
        <Route path="/users/:username" element={<UserView user={specificUser} isLoading={usersQuery.isLoading}/>} />
      </Routes>
    </Container>
  );
};

export default App;