import { useState } from "react";
import blogService from '../services/blogs';

const AddBlogForm = ({successMessage, errorMessage, addBlog}) => {
  const [title, setTitle] = useState(``);
  const [author, setAuthor] = useState(``);
  const [url, setUrl] = useState(``);

  const addNewblog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title,
      author,
      url
    };

    try{
      const response = await blogService.create(newBlog);
      addBlog(response);
      successMessage(`Added a new blog: ${response.title} by ${response.author}`);
    }
    catch(error){
      errorMessage(error.response.data.error);
    }
  };

  return (
    <form onSubmit={addNewblog}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};


export default AddBlogForm;