/**
 * Utility functions for making requests to the DAML Exchange backend API
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different port
const TEMPLATES_ENDPOINT = `${API_BASE_URL}/templates`;

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

/**
 * Fetch all DAML templates from the backend
 * @returns {Promise<Object>} The response containing template information
 */
async function fetchTemplates() {
  try {
    const response = await axios.get(TEMPLATES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    }
    throw error;
  }
}

/**
 * Example of using the fetch templates function with curl-like output
 */
async function templatesExample() {
  console.log('Executing curl-like request to fetch DAML templates...');
  console.log(`curl -X GET ${TEMPLATES_ENDPOINT}`);
  
  try {
    const result = await fetchTemplates();
    console.log('Response:');
    console.log(JSON.stringify(result, null, 2));
    
    // Check if we got templates and how many
    if (result && result.templates && Array.isArray(result.templates)) {
      console.log(`Successfully retrieved ${result.templates.length} templates`);
      
      // Show a summary of the templates
      if (result.templates.length > 0) {
        console.log('\nTemplate Summary:');
        result.templates.forEach((template, index) => {
          console.log(`${index + 1}. ${template.moduleName}.${template.entityName} (${template.choices?.length || 0} choices)`);
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Export the functions for use in other files
module.exports = {
  fetchParties,
  fetchPartiesWithAuth,
  fetchTemplates,
  curlExample,
  templatesExample
};

// If this file is run directly (node requests.js), execute examples
if (require.main === module) {
  // You can uncomment the example you want to run
  // curlExample()
  //   .then(() => console.log('Done with parties example!'))
  //   .catch(err => console.error('Error:', err));
  
  templatesExample()
    .then(() => console.log('Done with templates example!'))
    .catch(err => console.error('Error:', err));
}
