import { useState } from "react";

const AddCommentForm = ({ onAddCommentFormSent }) => {
  const [comment, setComment] = useState(``);

  const onSubmit = async (event) => {
    event.preventDefault();

    onAddCommentFormSent(comment);
    setComment(``);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type="text"
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type="submit">add comment</button>
    </form>
  );
};

export default AddCommentForm;