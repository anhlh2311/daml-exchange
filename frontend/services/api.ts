import axios from 'axios';
import { Party } from '@/types/party';

// API base URL - make sure this matches your backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// Interface for the response from the parties API
interface PartiesResponse {
  success: boolean;
  ledgerId: string;
  parties: Array<{
    displayName: string;
    identifier: string;
    isLocal: boolean;
  }>;
  status: string;
}

/**
 * Fetch parties from the backend API
 * @returns Promise with array of Party objects
 */
export async function fetchParties(): Promise<Party[]> {
  try {
    const response = await axios.get<PartiesResponse>(`${API_BASE_URL}/daml/parties`);
    
    // Map the API response to our Party interface with validation
    return response.data.parties.map(party => {
      // Ensure we have a valid identifier and displayName
      const identifier = party.identifier || 'unknown-id';
      const displayName = party.displayName || identifier.split(':')[0] || 'Unknown';
      
      return {
        id: identifier,
        displayName: displayName,
        // Default role assignment - you may want to adjust this based on your needs
        role: displayName.toLowerCase().includes('admin') ? 'admin' : 'holder' as any
      };
    });
  } catch (error) {
    console.error('Error fetching parties:', error);
    throw error;
  }
}

/**
 * Fetch parties with authentication
 * @param token JWT token for authentication
 * @returns Promise with array of Party objects
 */
export async function fetchPartiesWithAuth(token: string): Promise<Party[]> {
  try {
    const response = await axios.get<PartiesResponse>(
      `${API_BASE_URL}/daml/parties/authenticated`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data.parties.map(party => {
      // Ensure we have a valid identifier and displayName
      const identifier = party.identifier || 'unknown-id';
      const displayName = party.displayName || identifier.split(':')[0] || 'Unknown';
      
      return {
        id: identifier,
        displayName: displayName,
        // Default role assignment - you may want to adjust this based on your needs
        role: displayName.toLowerCase().includes('admin') ? 'admin' : 'holder' as any
      };
    });
  } catch (error) {
    console.error('Error fetching parties with authentication:', error);
    throw error;
  }
}
