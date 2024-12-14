import { useNotificationDispatch } from '../contexts/notificationContext';

export const useNotifications = () => {
  const notificationDispatch = useNotificationDispatch();

  const showNotification = (message, seconds = 5, type = `success`) => {
    notificationDispatch({ type: `SET`, payload: { message, type } });

    // Effectively refresh the timer if a notification already existed
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }

    window.notificationTimeout = setTimeout(() => {
      notificationDispatch({ type: `CLEAR` });
    }, seconds * 1000);
  };

  const successMessage = (msg) => showNotification(msg);

  const errorMessage = (msg) => showNotification(msg, 6, `error`);

  return { successMessage, errorMessage };
};
