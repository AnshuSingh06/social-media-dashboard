import React, { useState, useEffect } from "react";
import { Navbar, Form, FormControl, Button, Container, Nav, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getSearchSuggestions } from "../Services/api";

const HNavbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch search suggestions dynamically
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      getSearchSuggestions(searchQuery)
        .then((data) => setSuggestions(data)) // ✅ Correctly update suggestions
        .catch(() => setSuggestions([]));

      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    navigate(`/?search=${suggestion}`);
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm p-3 position-relative">
      <Container>
      <Navbar.Brand as={Link} to="/" className="fw-bold" onClick={() => navigate("/")}>
  Home
</Navbar.Brand>

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="me-auto"></Nav>
          <Form className="d-flex position-relative" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search user..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <Button variant="outline-success" type="submit">Search</Button>

            {/* ✅ Show Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
  <ListGroup className="position-absolute w-100 bg-white shadow mt-2" style={{ top: "100%", zIndex: 10 }}>
    {suggestions.map((suggestion, index) => (
      <ListGroup.Item 
        key={index} 
        action 
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </ListGroup.Item>
    ))}
  </ListGroup>
)}

            {/* ✅ Show "No data found" only when needed */}
            {showSuggestions && suggestions.length === 0 && searchQuery.trim().length > 1 && (
              <ListGroup className="position-absolute w-100 bg-white shadow mt-2" style={{ top: "100%", zIndex: 10 }}>
                <ListGroup.Item className="text-center text-muted">No data found</ListGroup.Item>
              </ListGroup>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HNavbar;
