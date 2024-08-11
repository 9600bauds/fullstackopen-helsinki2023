import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  
  const successMessage = (msg) => toast.success(msg);
  const errorMessage = (msg) => toast.error(msg,  {
    duration: 6000,
  });

  const findBlogFromID = (id) => {
    return blogs.find(b => b.id === id);
  };
  const updateBlogFromID = (id, newBlog) => {
    setBlogs(blogs.map(blog => blog.id !== id ? blog : newBlog));
  };
  const removeBlogFromID = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  const locallyAddBlog = newBlog => {
    //We're React guys, of course we don't mutate states
    setBlogs([...blogs, newBlog]);
  };

  const addLike = async (blogId) => {
    try{
      const theBlog = findBlogFromID(blogId);
      let newBlogObject = { ...theBlog };
      newBlogObject.likes++;
      const promise = blogService.update(blogId, newBlogObject);
      const response = await promise;
      updateBlogFromID(blogId, response);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  const deleteBlog = async (blogId) => {   
    try{
      await blogService.remove(blogId);
      removeBlogFromID(blogId,);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }    
  };

  const handleLogin = async (username, password) => {
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
      blogs.sort((a, b) => {
        if (a.likes > b.likes) {
          return -1; //I guess -1 goes first?
        }
        if (a.likes < b.likes) {
          return 1;
        }
        return 0;
      });
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
        <hr/>
        <Togglable buttonLabel="add new blog">
          <h2>Create New Blog</h2>
          <AddBlogForm
            successMessage={successMessage}
            errorMessage={errorMessage}
            addBlog={locallyAddBlog}
          />
        </Togglable>
        <h2>All Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog}/>
        )}
      </div>
    </>
  );
};

export default App;