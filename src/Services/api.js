import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Search profiles (case-insensitive search on username & displayName)
export const searchProfiles = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/socialProfiles`, {
      params: {
        username_like: searchTerm,
        displayName_like: searchTerm,
        _limit: 10, // Optional: limit results
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching profiles:', error);
    return []; // Return an empty array to prevent breaking UI
  }
};

// Get profile by ID
export const getProfileById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/socialProfiles/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Profile with ID ${id} not found.`);
      return null; // Return null to prevent UI crashes
    }
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/socialProfiles`, {
      params: { username_like: query, _limit: 5 }, // Fetch matching usernames
    });
    console.log("Suggestions:", response.data); // 🔹 Debugging
    return response.data.map(profile => profile.username); // Only return usernames
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};


