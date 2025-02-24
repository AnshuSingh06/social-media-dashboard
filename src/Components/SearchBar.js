import { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]); // Clear if empty
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`http://localhost:3001/socialProfiles?q=${query}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // Debounce API calls

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSelectSuggestion = (profile) => {
    setQuery(profile.username);
    setShowSuggestions(false);
    onSearch(profile.username);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
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
