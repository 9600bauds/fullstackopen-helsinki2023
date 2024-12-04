import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './contexts/userContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById(`root`)).render(
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <Toaster />
      <App />
    </UserContextProvider>
  </QueryClientProvider>
);