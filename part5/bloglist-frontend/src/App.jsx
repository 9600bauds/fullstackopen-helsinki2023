import { useState, useEffect } from 'react';
import './App.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';

function App() {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [user, setUser] = useState(null);

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function getData(){
            const allBlogs = await blogService.getAll();
            setBlogs(allBlogs);
            console.log(allBlogs);
        }
        getData();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault(); //do not refresh, do not pass go, do not collect 200$
        if (!username || !password) {
            toast.error('Username and password are required!');
            return;
        }
        
        try {
            const user = await loginService.login({
                username, password,
            });
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            toast.error('Wrong credentials!');
            return;
        }
    };

    function getLoginOrBloglist(){
        if (user === null) {
            return (
                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                        password
                        <input
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type="submit">login</button>
                </form>
            );
        }
        
        else {
            return (
                <div>
                    <h2>Welcome, {user.name}.</h2>
                    <h3>List of All Blogs</h3>
                    {blogs.map(blog =>
                        <Blog key={blog.id} blog={blog} />
                    )}
                </div>
            );
        }
    }

    return (
        <>
            <ToastContainer />
            {getLoginOrBloglist()}
        </>
    );
}

export default App;
