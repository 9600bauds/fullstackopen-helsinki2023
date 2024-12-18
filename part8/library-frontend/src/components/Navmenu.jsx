import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navmenu = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto d-flex align-items-center">
          <Nav.Link as="span">
            <Link to="/">books</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link to="/authors">authors</Link>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navmenu;
