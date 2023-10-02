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

    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function getData(){
            const allBlogs = await blogService.getAll();
            setBlogs(allBlogs);
        }
        getData();
    }, []);

    useEffect(() => {
        const savedUserJSON = window.localStorage.getItem('savedUser');
        if (savedUserJSON) {
            const user = JSON.parse(savedUserJSON);
            setUser(user);
        }
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
            window.localStorage.setItem('savedUser', JSON.stringify(user)); 
            setUsername('');
            setPassword('');
        } catch (exception) {
            toast.error('Wrong credentials!');
            return;
        }
    };

    const handleNewBlog = async (event) => {
        event.preventDefault(); //do not refresh, do not pass go, do not collect 200$
        if (!newTitle || !newUrl) {
            toast.error('All fields are required!');
            return;
        }
        
        try {
            const newBlogPojo = { title: newTitle, url: newUrl };
            const newBlogResponse = await blogService.create(newBlogPojo, user.token);
            toast.success(
                <>
                  Created a new blog: 
                    <Blog key={newBlogResponse.id} blog={newBlogResponse}/>
                </>
            );
            setNewTitle('');
            setNewUrl('');
        } catch (exception) {
            toast.error('Failed to create blog! Check the console for more information.');
            console.log('failed to create blog:', exception);
            return;
        }
    };
    
    const logOutFunc = () => {
        setUser(null);
        window.localStorage.removeItem('savedUser'); 
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
                    <button onClick={logOutFunc}>
                        (Log Out)
                    </button>
                    <h3>Create New Blog</h3>
                    <form onSubmit={handleNewBlog}>
                        <div>
                        Title
                            <input
                                type="text"
                                value={newTitle}
                                name="Title"
                                onChange={({ target }) => setNewTitle(target.value)}
                            />
                        </div>
                        <div>
                        URL
                            <input
                                type="text"
                                value={newUrl}
                                name="URL"
                                onChange={({ target }) => setNewUrl(target.value)}
                            />
                        </div>
                        <button type="submit">post it!</button>
                    </form>
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
