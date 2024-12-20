import { useMutation, useQuery } from '@apollo/client';
import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries';
import useField from '../hooks/useField';
import { useNotifications } from '../hooks/useNotifications';
import { useState } from 'react';
import Select from 'react-select';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EditAuthorBornForm = () => {
  const { successMessage, errorMessage } = useNotifications();
  const [name, setName] = useState(``);
  const born = useField(`born`);

  const [editAuthorBorn] = useMutation(EDIT_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join(`\n`);
      errorMessage(messages);
    },
    onCompleted: (response) => {
      const editedAuthor = response.editAuthor;
      if (!editedAuthor) {
        return errorMessage(
          `Request returned null (Could not find that author?)`
        );
      }
      successMessage(`Updated the birthyear for ${editedAuthor.name}`);
      born.reset();
    },
  });

  const token = localStorage.getItem(`libraryToken`);
  if (!token) {
    return (
      <div>
        <Alert>
          You must be <Link to="/login">logged in</Link> to edit an
          author&apos;s birthyear.
        </Alert>
      </div>
    );
  }

  const authorNameQuery = useQuery(ALL_AUTHORS);

  if (authorNameQuery.loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <Spinner animation="border" />
      </div>
    );
  }

  const authorNames = authorNameQuery.data.allAuthors;

  const selectOptions = authorNames.map((author) => {
    return { value: author.name, label: author.name };
  });
  const optionSelected = (option) => {
    setName(option.value);
  };

  const submit = async (event) => {
    event.preventDefault();

    await editAuthorBorn({
      variables: { name: name, setBornTo: parseInt(born.value) },
    });
  };

  return (
    <div>
      <h3>Edit Author Birthyear</h3>
      <form onSubmit={submit}>
        <Select
          defaultValue={name}
          onChange={optionSelected}
          options={selectOptions}
        />
        <div>
          birthyear
          <input {...born.toInput()} />
        </div>
        <button type="submit">send</button>
      </form>
    </div>
  );
};

export default EditAuthorBornForm;
