import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navmenu = () => {

  const { user, logOut } = useAuth();

  if(!user){
    return null;
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto d-flex align-items-center" >
          <Nav.Link as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <div data-testid="welcome-msg">
              Welcome {user.name}! If that isn&apos;t you,&nbsp;
              <button
                data-testid="logout-btn"
                onClick={logOut}
              >
                log out
              </button>
            </div>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navmenu;