import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HNavbar from "../Common/HNavbar";
import { searchProfiles } from "../Services/api";
import '../css/Home.css';

const Home = () => {
  const [profiles, setProfiles] = useState([]); //  Store multiple profiles
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract Search Query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");
  const [searched, setSearched] = useState(false);
  

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    // If the search query is empty, the function returns early.
    setLoading(true);
  
    try {
      const results = await searchProfiles(query);
      
      // Find exact match instead of taking the first one
      const exactMatch = results.find(profile => profile.username.toLowerCase() === query.toLowerCase());
  
      if (exactMatch) {
        setProfiles([exactMatch]); //  Store only the selected profile
      } else {
        setProfiles([]); // No match found
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setProfiles([]);
    }
  
    setLoading(false);
  };
  
  
  
    
  

  return (
    <>
      <HNavbar onSearch={handleSearch} />
    
<div className="carousel-inner">
        <div className="carousel-item active">
          <img 
            src="/image/s2.jpg" 
            alt="..." 
          />
         
        </div>
      </div><br/>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        {/*  Table to Display Search Results */}
        <div className="table-container mt-6 w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg">
  {loading ? (
    <p className="text-center text-blue-500 font-semibold">Searching...</p>
  ) : profiles.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>Username</th>
            <th>Display Name</th>
            <th>Platform</th>
            <th>Subscribers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>
                <img src={profile.profileImageUrl} alt={profile.username} className="profile-img mx-auto" />
              </td>
              <td>{profile.username}</td>
              <td>{profile.displayName}</td>
              <td className="capitalize">{profile.platform}</td>
              <td>{profile.subscriberCount || "N/A"}</td>
              <td>
                <button 
                  onClick={() => navigate(`/profile/${profile.id}`)} 
                  className="green-button"
                >
                  See Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center text-gray-500 font-semibold">No profiles found.</p>
  )}
</div>
</div>
      
    </>
  );
};

export default Home;
