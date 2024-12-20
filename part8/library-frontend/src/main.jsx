import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router } from 'react-router-dom';

import { NotificationContextProvider } from './contexts/notificationContext';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(`libraryToken`);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = createHttpLink({
  uri: `http://localhost:4000`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById(`root`)).render(
  <React.StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <NotificationContextProvider>
          <App />
        </NotificationContextProvider>
      </ApolloProvider>
    </Router>
  </React.StrictMode>
);
