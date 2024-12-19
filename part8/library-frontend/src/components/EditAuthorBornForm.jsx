import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries';
import useField from '../hooks/useField';
import { useNotifications } from '../hooks/useNotifications';

const EditAuthorBornForm = () => {
  const { successMessage, errorMessage } = useNotifications();

  const name = useField(`name`);
  const born = useField(`born`);

  const [editAuthorBorn] = useMutation(EDIT_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join(`\n`);
      errorMessage(messages);
    },
    onCompleted: (response) => {
      const editedAuthor = response.editAuthor;
      successMessage(`Updated the birthyear for ${editedAuthor.name}`);
      name.reset();
      born.reset();
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await editAuthorBorn({
      variables: { name: name.value, setBornTo: parseInt(born.value) },
    });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input {...name.toInput()} />
        </div>
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
