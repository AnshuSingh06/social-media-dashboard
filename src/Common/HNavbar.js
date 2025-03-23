import React, { useState, useEffect } from "react";
import { Navbar, Form, FormControl, Button, Container, Nav, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getSearchSuggestions } from "../Services/api";

const HNavbar = ({ onSearch }) => { 
  const [searchQuery, setSearchQuery] = useState("");  
  const [suggestions, setSuggestions] = useState([]);  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // ✅ Debounce API Calls (300ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const data = await getSearchSuggestions(searchQuery);
        
        // ✅ Always match names that start with the search term (without showing checkbox)
        const filteredData = data.filter(suggestion => 
          suggestion.toLowerCase().startsWith(searchQuery.toLowerCase())
        );

        setSuggestions(filteredData.slice(0, 5)); // Limit results
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // ✅ Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
      navigate(`/?search=${searchQuery}`);
    }
  };

  // ✅ Handle Suggestion Click
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
            {/* ✅ Search Input Field */}
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

            {/* ✅ Show "No data found" */}
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
