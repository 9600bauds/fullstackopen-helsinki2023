import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { createAnecdote, getAnecdotes, updateAnecdote } from "./requests";
import { useNotificationDispatch } from "./NotificationContext";

const App = () => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  });
  const anecdotes = result.data;

  const notificationDispatch = useNotificationDispatch();
  const showNotification = (message, seconds = 5) => {
    notificationDispatch({ type: "SET", payload: message });

    // Effectively refresh the timer if a notification already existed
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }

    window.notificationTimeout = setTimeout(() => {
      notificationDispatch({ type: "CLEAR" });
    }, seconds * 1000);
  };

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      showNotification(`Added new anecdote: ${newAnecdote.content}`);
    },
    onError: (error) => {
      showNotification(
        `${error.response.statusText}: ${error.response.data.error}`,
      );
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (anecdote) => {
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
      return await updateAnecdote(updatedAnecdote);
    },
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      const updatedAnecdotes = anecdotes.map((a) =>
        a.id === updatedAnecdote.id ? updatedAnecdote : a,
      );
      queryClient.setQueryData(["anecdotes"], updatedAnecdotes);
      showNotification(
        `Voted on anecdote: ${updatedAnecdote.content}, which now has ${updateAnecdote.votes} votes!`,
      );
    },
    onError: (error) => {
      showNotification(
        `${error.response.statusText}: ${error.response.data.error}`,
      );
    },
  });

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote);
  };

  if (result.isError) {
    return <div>error: could not fetch data from server!</div>;
  }

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm newAnecdoteMutation={newAnecdoteMutation} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
