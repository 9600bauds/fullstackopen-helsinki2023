import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

const Navmenu = ({ logOut }) => {

  const user = useUserContext();

  if(!user){
    return null;
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link  to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <div data-testid='welcome-msg'>
              Welcome {user.name}! If that isn&apos;t you, <button data-testid='logout-btn' onClick={logOut}>log out</button>
            </div>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navmenu;