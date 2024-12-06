import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './contexts/userContext';
import { NotificationContextProvider } from './contexts/notificationContext';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById(`root`)).render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <UserContextProvider>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </UserContextProvider>
    </Router>
  </QueryClientProvider>
);