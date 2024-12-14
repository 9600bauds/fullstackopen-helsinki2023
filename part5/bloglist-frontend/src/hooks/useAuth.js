import { useContext } from 'react';
import userContext from '../contexts/userContext';
import blogService from '../services/blogs';
import loginService from '../services/login';

export const useAuth = () => {
  const [user, userDispatch] = useContext(userContext);

  const onSuccessfulLogin = (user) => {
    userDispatch({ type: `SET`, payload: user });
    blogService.setToken(user.token); //Should this still directly set the token on another service, like that?
    localStorage.setItem(`blogAppUser`, JSON.stringify(user));
  };

  const logIn = async (username, password) => {
    const user = await loginService.login({
      username, password,
    });
    onSuccessfulLogin(user);
  };

  const logOut = () => {
    userDispatch({ type: `CLEAR` });
    localStorage.removeItem(`blogAppUser`);
  };

  const checkForSavedCredentials = () => {
    if (user) return; //We are already logged in!

    const loggedUserJSON = window.localStorage.getItem(`blogAppUser`);
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      onSuccessfulLogin(loggedUser);
    }
  };

  return { user, logIn, logOut, checkForSavedCredentials };
};
