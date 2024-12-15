import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';

import Navmenu from './components/Navmenu';
import Notification from './components/Notification';

import Home from './views/Home';
import UsersView from './views/UsersView';
import LoginView from './views/LoginView';
import UserView from './views/UserView';
import BlogView from './views/BlogView';

import { Container } from 'react-bootstrap';

const App = () => {
  const { user, checkForSavedCredentials } = useAuth();

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
            <Home />
          }
        />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:username" element={<UserView />} />
      </Routes>
    </Container>
  );
};

export default App;