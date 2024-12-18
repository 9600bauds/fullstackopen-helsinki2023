import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationContextProvider } from './contexts/notificationContext';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `http://localhost:4000`,
  cache: new InMemoryCache(),
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
