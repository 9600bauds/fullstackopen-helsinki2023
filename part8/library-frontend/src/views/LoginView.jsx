import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import useField from '../hooks/useField';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const { successMessage, errorMessage } = useNotifications();

  const { logIn } = useAuth();

  const navigate = useNavigate();

  const usernameField = useField(`username`);
  const passwordField = useField(`password`);

  const submit = async (event) => {
    event.preventDefault();

    try {
      await logIn({
        variables: {
          username: usernameField.value,
          password: passwordField.value,
        },
      });
      successMessage(`You are now logged in!`);
      navigate(-1);
    } catch (error) {
      const messages = error.graphQLErrors.map((e) => e.message).join(`\n`);
      errorMessage(messages);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username&nbsp;
          <input {...usernameField.toInput()} />
        </div>
        <div>
          password&nbsp;
          <input {...passwordField.toInput()} type="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginView;
