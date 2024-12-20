import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../queries';
import { useApolloClient, useMutation } from '@apollo/client';

export const useAuth = () => {
  const client = useApolloClient();
  const navigate = useNavigate();

  const onSuccessfulLogin = (token) => {
    localStorage.setItem(`libraryToken`, token);
  };

  const [logIn] = useMutation(LOGIN, {
    onCompleted: (response) => {
      const token = response.login.value;
      onSuccessfulLogin(token);
    },
  });

  const logOut = () => {
    localStorage.clear();
    client.resetStore();
    navigate(`/`); //Shamelessly lazy solution to: "how can I have a context that can be used from the root element for Apollo".
  };

  return { logIn, logOut };
};
