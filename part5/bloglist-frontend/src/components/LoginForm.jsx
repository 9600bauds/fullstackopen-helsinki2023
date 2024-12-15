import { useState } from 'react';
import { Form, Button } from "react-bootstrap";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="formUsername" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          data-testid='login-username'
          onChange={({ target }) => setUsername(target.value)}
          placeholder="Enter username"
        />
      </Form.Group>
      <Form.Group controlId="formPassword" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          data-testid='login-password'
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Enter password"
        />
      </Form.Group>
      <Button variant="primary" type="submit" data-testid='login-submit-btn'>login</Button>
    </Form>
  );
};

export default LoginForm;