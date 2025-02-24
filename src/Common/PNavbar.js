import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const PNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm p-3">
      <Container>
        <Nav className="ms-auto"> {/* Move "Home" to the right side */}
          <Nav.Link as={Link} to="/" className="fw-bold" onClick={() => navigate("/")}>
            Home
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default PNavbar;
