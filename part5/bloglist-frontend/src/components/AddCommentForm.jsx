import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const AddCommentForm = ({ onAddCommentFormSent }) => {
  const [comment, setComment] = useState(``);

  const onSubmit = async (event) => {
    event.preventDefault();

    onAddCommentFormSent(comment);
    setComment(``);
  };

  return (
    <Form onSubmit={onSubmit} className="mt-2">
      <Form.Group className="mb-2">
        <Form.Control
          type="text"
          placeholder="Enter comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="primary">add comment</Button>
    </Form>
  );
};

export default AddCommentForm;