import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useBlogActions } from "../hooks/useBlogActions";
import { Form, Button, Stack } from "react-bootstrap";

const AddBlogForm = () => {
  const [title, setTitle] = useState(``);
  const [author, setAuthor] = useState(``);
  const [url, setUrl] = useState(``);

  const { successMessage, errorMessage } = useNotifications();
  const { createBlog } = useBlogActions();

  const addNewblog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const response = await createBlog(newBlog);
      successMessage(`Added a new blog: ${response.title} by ${response.author}`);
      setTitle(``);
      setAuthor(``);
      setUrl(``);
    } catch (error) {
      errorMessage(error.response.data.error);
    }
  };

  return (
    <Form onSubmit={addNewblog} className="p-0">
      <Form.Group className="mb-2" controlId="formTitle">
        <Form.Label className="mb-0">Title:</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="formAuthor">
        <Form.Label className="mb-0">Author:</Form.Label>
        <Form.Control
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter blog author"
        />
      </Form.Group>
      <Form.Group className="mb-2" controlId="formUrl">
        <Form.Label className="mb-0">URL:</Form.Label>
        <Form.Control
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter blog url"
        />
      </Form.Group>
      <Stack direction="horizontal" className="mt-2">
        <Button variant="primary" type="submit" className="me-2">
          Submit
        </Button>
      </Stack>
    </Form>
  );
};

export default AddBlogForm;