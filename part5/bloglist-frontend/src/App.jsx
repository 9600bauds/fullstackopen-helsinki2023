import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const [user, setUser] = useState(null);
  
  const successMessage = (msg) => toast.success(msg);
  const errorMessage = (msg) => toast.error(msg,  {
    duration: 6000,
  });

  const locallyAddBlog = newBlog => {
    //We're React guys, of course we don't mutate states
    setBlogs([...blogs, newBlog]);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try{
      const user = await loginService.login({
        username, password,
      });
      onSuccessfulLogin(user);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const onSuccessfulLogin = (user) => {
    setUser(user);
    setUsername(``);
    setPassword(``);
    blogService.setToken(user.token);
    window.localStorage.setItem(
      `blogAppUser`, JSON.stringify(user)
    ); 
  };

  const logOut = () => {
    setUser(null);
    window.localStorage.removeItem(`blogAppUser`);
  };

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs );
    }
    );  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(`blogAppUser`);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      onSuccessfulLogin(user);
    }
  }, []);

  if (user === null) {
    return (
      <>
        <div><Toaster/></div>
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
      </>
    );
  }

  return (
    <>
      <div><Toaster/></div>
      <div>
      Welcome {user.name}! If that isn&apos;t you, <button onClick={logOut}>log out</button>
        <h2>Create New Blog</h2>
        <AddBlogForm
          successMessage={successMessage}
          errorMessage={errorMessage}
          addBlog={locallyAddBlog}
        />
        <h2>All Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </>
  );
};

export default App;