
import { useState } from 'react';

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin(username, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          data-testid='login-username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          data-testid='login-password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" data-testid='login-submit-btn'>login</button>
    </form>
  );
};

export default LoginForm;