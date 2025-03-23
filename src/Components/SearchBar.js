import { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [matchInitial, setMatchInitial] = useState(true); // New state for checkbox

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`http://localhost:3001/socialProfiles`);
        const data = await response.json();

        console.log("Fetched Data:", data); // Debugging API Response

        let filteredData;
        if (matchInitial) {
          // Strictly filter users whose names START with the query
          filteredData = data.filter(profile =>
            profile.displayName.toLowerCase().startsWith(query.toLowerCase()) ||
            profile.username.toLowerCase().startsWith(query.toLowerCase())
          );
        } else {
          // Show all names containing the query anywhere
          filteredData = data.filter(profile =>
            profile.displayName.toLowerCase().includes(query.toLowerCase()) ||
            profile.username.toLowerCase().includes(query.toLowerCase())
          );
        }

        console.log("Filtered Suggestions:", filteredData); // Debugging Filtered Data

        setSuggestions(filteredData.slice(0, 5));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, matchInitial]); // Depend on query & checkbox state

  const handleSelectSuggestion = (profile) => {
    setQuery(profile.username);
    setShowSuggestions(false);
    onSearch(profile.username);
  };

  return (
    <div className="relative">
      {/* Search Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value.trim());
          setShowSuggestions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(query);
            setShowSuggestions(false);
          }
        }}
        placeholder="Search profiles..."
        className="w-full p-2 border rounded-md"
      />

      {/* Checkbox to enable "Starts With" filtering */}
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="matchInitial"
          checked={matchInitial}
          onChange={(e) => setMatchInitial(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="matchInitial">Match Initial Letters</label>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border mt-1 rounded-md shadow-lg">
          {suggestions.map((profile) => (
            <li
              key={profile.id}
              onClick={() => handleSelectSuggestion(profile)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {profile.displayName} (@{profile.username})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
