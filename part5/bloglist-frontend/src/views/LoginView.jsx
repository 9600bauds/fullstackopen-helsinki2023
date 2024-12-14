import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";

const LoginView = () => {

  const { logIn } = useAuth();
  const { successMessage, errorMessage } = useNotifications();

  const handleLogin = async (username, password) => {
    try{
      await logIn(username, password);
      successMessage(`Logged in!`);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Log in to continue</h2>
      <LoginForm
        handleLogin={handleLogin}
      />
    </div>
  );
};
export default LoginView;