/**
 * Utility functions for making requests to the DAML Exchange backend API
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different port
const TEMPLATES_ENDPOINT = `${API_BASE_URL}/templates`;
const CONTRACTS_ENDPOINT = `${API_BASE_URL}/contracts`;
const GRAPHQL_ENDPOINT = 'http://localhost:7500/api/graphql'; // DAML GraphQL API endpoint

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
 * Fetch all DAML templates from the backend API endpoint
 * This calls the templates controller endpoint which now uses GraphQL internally
 * @returns {Promise<Object>} The response containing template information
 */
async function fetchTemplates() {
  try {
    console.log(`Fetching templates from backend API: ${TEMPLATES_ENDPOINT}...`);
    console.log('This endpoint now uses GraphQL internally to fetch templates');
    
    const startTime = new Date().getTime();
    const response = await axios.get(TEMPLATES_ENDPOINT);
    const endTime = new Date().getTime();
    
    console.log(`Successfully fetched templates. Status: ${response.status}`);
    console.log(`Request took ${endTime - startTime}ms to complete`);
    
    if (response.data && response.data.metadata) {
      console.log(`Template source: ${response.data.metadata.source || 'Unknown'}`);
      console.log(`Templates count: ${response.data.metadata.count || 0}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching templates from backend API:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Error source:', error.response.data?.source || 'Unknown');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the backend server running?');
      console.error('Make sure to start the backend with: npm start');
    }
    throw error;
  }
}



/**
 * Example of using the fetch templates function
 * This demonstrates how to fetch templates from the backend API endpoint
 * which now uses GraphQL internally to get template data
 */
async function templatesExample() {
  console.log('='.repeat(80));
  console.log('EXECUTING TEMPLATES EXAMPLE');
  console.log('This demonstrates fetching templates from the backend API endpoint');
  console.log('The backend now uses GraphQL to fetch template data from the DAML ledger');
  console.log('='.repeat(80));
  
  try {
    // Fetch templates from the backend API
    const result = await fetchTemplates();
    
    // Check if we got a valid response
    if (!result || !result.success) {
      console.error('Failed to fetch templates or received invalid response');
      return;
    }
    
    // Extract and display template information
    if (result.templates && Array.isArray(result.templates)) {
      const templates = result.templates;
      
      // Display template count by module
      if (result.metadata && result.metadata.moduleBreakdown) {
        console.log('\nTemplates by Module:');
        for (const [module, count] of Object.entries(result.metadata.moduleBreakdown)) {
          console.log(`- ${module}: ${count} template(s)`);
        }
      }
      
      // Display template details
      console.log('\nTemplate Details:');
      templates.slice(0, 5).forEach((template, index) => {
        console.log(`\n${index + 1}. ${template.templateId}`);
        console.log(`   - Package ID: ${template.packageId}`);
        console.log(`   - Module: ${template.moduleName}`);
        console.log(`   - Entity: ${template.entityName}`);
        
        // Show contract count if available
        if (template.contractCount !== undefined) {
          console.log(`   - Contract Count: ${template.contractCount}`);
        }
        
        // Show available choices if any
        if (template.choices && template.choices.length > 0) {
          console.log(`   - Available Choices: ${template.choices.map(c => c.name).join(', ')}`);
        }
      });
      
      // If there are more templates, show a message
      if (templates.length > 5) {
        console.log(`\n... and ${templates.length - 5} more templates (showing first 5 only)`);
      }
      
      // Display template statistics
      console.log('\nTemplate Statistics:');
      console.log(`- Total Templates: ${templates.length}`);
      
      // Count templates with contracts if contractCount is available
      const templatesWithContracts = templates.filter(t => t.contractCount && t.contractCount > 0).length;
      if (templatesWithContracts > 0) {
        console.log(`- Templates with Contracts: ${templatesWithContracts}`);
      }
      
      // Count templates with choices
      const templatesWithChoices = templates.filter(t => t.choices && t.choices.length > 0).length;
      console.log(`- Templates with Choices: ${templatesWithChoices}`);
    }
    
    console.log('\nTemplate fetch completed successfully!');
    return result;
  } catch (error) {
    console.error('Template request failed:', error.message);
    console.error('Make sure the backend server is running and accessible');
  }
}

/**
 * Fetch all DAML contracts from the backend API endpoint
 * This calls the contracts controller endpoint which uses GraphQL internally
 * @returns {Promise<Object>} The response containing contract information
 */
async function fetchContracts() {
  try {
    console.log(`Fetching contracts from backend API: ${CONTRACTS_ENDPOINT}...`);
    console.log('This endpoint uses GraphQL internally to fetch active contracts');
    
    const startTime = new Date().getTime();
    const response = await axios.get(CONTRACTS_ENDPOINT);
    const endTime = new Date().getTime();
    
    console.log(`Successfully fetched contracts. Status: ${response.status}`);
    console.log(`Request took ${endTime - startTime}ms to complete`);
    
    if (response.data && response.data.metadata) {
      console.log(`Contract source: ${response.data.metadata.source || 'Unknown'}`);
      console.log(`Contracts count: ${response.data.metadata.count || 0}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts from backend API:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Error source:', error.response.data?.source || 'Unknown');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the backend server running?');
      console.error('Make sure to start the backend with: npm start');
    }
    throw error;
  }
}

/**
 * Example of using the fetch contracts function
 * This demonstrates how to fetch contracts from the backend API endpoint
 * which uses GraphQL internally to get contract data
 */
async function contractsExample() {
  console.log('='.repeat(80));
  console.log('EXECUTING CONTRACTS EXAMPLE');
  console.log('This demonstrates fetching contracts from the backend API endpoint');
  console.log('The backend uses GraphQL to fetch contract data from the DAML ledger');
  console.log('='.repeat(80));
  
  try {
    // Fetch contracts from the backend API
    const result = await fetchContracts();
    
    // Check if we got a valid response
    if (!result || !result.success) {
      console.error('Failed to fetch contracts or received invalid response');
      return;
    }
    
    // Extract and display contract information
    if (result.contracts && Array.isArray(result.contracts)) {
      const contracts = result.contracts;
      
      // Display contract count by template
      if (result.metadata && result.metadata.templateBreakdown) {
        console.log('\nContracts by Template:');
        for (const [template, count] of Object.entries(result.metadata.templateBreakdown)) {
          console.log(`- ${template}: ${count} contract(s)`);
        }
      }
      
      // Display contract details
      console.log('\nContract Details:');
      contracts.slice(0, 5).forEach((contract, index) => {
        console.log(`\n${index + 1}. Contract ID: ${contract.id}`);
        console.log(`   - Template: ${contract.templateId}`);
        console.log(`   - Created: ${new Date(contract.createTime).toLocaleString()}`);
        console.log(`   - Archived: ${contract.archived ? 'Yes' : 'No'}`);
        
        // Show available choices if any
        if (contract.choices && contract.choices.length > 0) {
          console.log(`   - Available Choices: ${contract.choices.map(c => c.name).join(', ')}`);
        }
        
        // Show contract arguments (payload)
        console.log('   - Arguments:');
        try {
          const args = contract.argument;
          if (typeof args === 'object') {
            Object.entries(args).forEach(([key, value]) => {
              console.log(`     * ${key}: ${JSON.stringify(value)}`);
            });
          } else {
            console.log(`     * ${args}`);
          }
        } catch (e) {
          console.log(`     * Error parsing arguments: ${e.message}`);
        }
      });
      
      // If there are more contracts, show a message
      if (contracts.length > 5) {
        console.log(`\n... and ${contracts.length - 5} more contracts (showing first 5 only)`);
      }
      
      // Display contract statistics
      console.log('\nContract Statistics:');
      console.log(`- Total Contracts: ${contracts.length}`);
      
      // Count active vs archived contracts
      const archivedContracts = contracts.filter(c => c.archived).length;
      const activeContracts = contracts.length - archivedContracts;
      console.log(`- Active Contracts: ${activeContracts}`);
      console.log(`- Archived Contracts: ${archivedContracts}`);
    }
    
    console.log('\nContract fetch completed successfully!');
    return result;
  } catch (error) {
    console.error('Contract request failed:', error.message);
    console.error('Make sure the backend server is running and accessible');
  }
}

// Export the functions for use in other files
module.exports = {
  fetchParties,
  fetchPartiesWithAuth,
  fetchTemplates,
  templatesExample,
  fetchContracts,
  contractsExample
};

// If this file is run directly (node requests.js), execute examples
if (require.main === module) {
  // You can uncomment the example you want to run
  // curlExample()
  //   .then(() => console.log('Done with parties example!'))
  //   .catch(err => console.error('Error:', err));
  
  // Run both examples sequentially
  templatesExample()
    .then(() => console.log('Done with templates example!'))
    .then(() => {
      console.log('\n');
      return contractsExample();
    })
    .then(() => console.log('Done with contracts example!'))
    .catch(err => console.error('Error:', err));
}

