import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const [user, setUser] = useState(null);
  
  const handleLogin = async (event) => {
    event.preventDefault();
    
    const user = await loginService.login({
      username, password,
    });
    setUser(user);
    setUsername(``);
    setPassword(``);
  };

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs );
    }
    );  
  }, []);

  if (user === null) {
    return (
      <div>
        <h2>Log in to continue</h2>
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  );
};

export default App;