import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { FaStackOverflow } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { UserContext } from "./UserContext";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    window.location.replace("http://localhost:3000/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <FaStackOverflow size={"30px"} />
            Pile<span style={{ fontWeight: "bold" }}>flood</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {user === null && (
              <Nav>
                <Nav.Link href="/login">
                  <Button variant="outline-primary">Log in</Button>
                </Nav.Link>
                <Nav.Link href="/register">
                  <Button variant="primary">Sign up</Button>
                </Nav.Link>
              </Nav>
            )}
            {user !== null && (
              <Nav>
                <Nav.Link href="">
                  <Button variant="outline-primary">{user.username}</Button>
                </Nav.Link>
                <Nav.Link href="">
                  <Button variant="primary" onClick={handleLogout}>
                    Log out
                  </Button>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
