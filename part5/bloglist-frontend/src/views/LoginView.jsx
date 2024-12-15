import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { Card, Spinner } from "react-bootstrap";
import { useState } from "react";

const LoginView = () => {
  const { logIn } = useAuth();
  const { successMessage, errorMessage } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    try {
      await logIn(username, password);
      successMessage(`Logged in!`);
    } catch (error) {
      errorMessage(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-3" style={{ maxWidth: `400px`, margin: `auto` }}>
      <Card.Body>
        <Card.Title>Log in to continue</Card.Title>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <LoginForm handleLogin={handleLogin} />
        )}
      </Card.Body>
    </Card>
  );
};

export default LoginView;