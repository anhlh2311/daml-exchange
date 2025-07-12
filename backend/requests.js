/**
 * Utility functions for making requests to the DAML Exchange backend API
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different port

/**
 * Fetch parties from the DAML ledger using the getParties endpoint
 * This uses the hardcoded token endpoint that doesn't require authentication
 * @returns {Promise<Object>} The response containing parties information
 */
async function fetchParties() {
  try {
    const response = await axios.get(`${API_BASE_URL}/daml/parties`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parties:', error.message);
    throw error;
  }
}

/**
 * Fetch parties from the DAML ledger using authentication
 * @param {string} token - The JWT token for authentication
 * @returns {Promise<Object>} The response containing parties information
 */
async function fetchPartiesWithAuth(token) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/daml/parties/authenticated`, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching parties with authentication:', error.message);
    throw error;
  }
}

/**
 * Example of using the fetch parties function with curl-like output
 */
async function curlExample() {
  console.log('Executing curl-like request to fetch parties...');
  console.log('curl -X GET http://localhost:3001/api/daml/parties');
  
  try {
    const result = await fetchParties();
    console.log('Response:');
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Export the functions for use in other files
module.exports = {
  fetchParties,
  fetchPartiesWithAuth,
  curlExample
};

// If this file is run directly (node requests.js), execute the curlExample
if (require.main === module) {
  curlExample()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error:', err));
}
