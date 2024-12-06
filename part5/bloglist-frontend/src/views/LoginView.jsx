import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useUserContext } from "../contexts/userContext";

const LoginView = ({ handleLogin }) => {
  const user = useUserContext();
  if(user !== null){
    return <Navigate replace to="/" />;
  }
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