import { useState } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { Container } from 'react-bootstrap';

import Notification from './components/Notification';
import Navmenu from './components/Navmenu';

import Authors from './views/Authors';
import Books from './views/Books';
import AddBookForm from './components/AddBookForm';

const App = () => {
  return (
    <Container>
      <Navmenu />
      <Notification />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/addBook" element={<AddBookForm />} />
      </Routes>
    </Container>
  );
};

export default App;
