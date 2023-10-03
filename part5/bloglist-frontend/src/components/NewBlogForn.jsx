import { useState } from 'react';
import { toast } from 'react-toastify';
import Blog from './Blog';

const NewFormBlog = ({ addBlog }) => {

    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    const handleNewBlog = async (event) => {
        event.preventDefault(); //do not refresh, do not pass go, do not collect 200$
        if (!newTitle || !newUrl) {
            toast.error('All fields are required!');
            return;
        }
        
        try {
            const newBlogPojo = { title: newTitle, url: newUrl };
            const newBlogResponse = await addBlog(newBlogPojo);
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

    return (
        <div>
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
        </div>  
    );
};
  
export default NewFormBlog;