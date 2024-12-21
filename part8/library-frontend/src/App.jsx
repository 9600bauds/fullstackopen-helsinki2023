import { Routes, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Notification from './components/Notification';
import Navmenu from './components/Navmenu';

import Authors from './views/Authors';
import Books from './views/Books';
import AddBookForm from './components/AddBookForm';
import LoginView from './views/LoginView';
import Recommended from './views/Recommended';

const App = () => {
  return (
    <Container>
      <Navmenu />
      <Notification />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/addBook" element={<AddBookForm />} />
      </Routes>
    </Container>
  );
};

export default App;
