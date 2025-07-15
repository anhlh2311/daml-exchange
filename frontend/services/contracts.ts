import axios from 'axios';

// API base URL - make sure this matches your backend URL
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Interface for DAML contract choice
 */
export interface DamlChoice {
  name: string;
  inheritedInterface?: string;
}

/**
 * Interface for DAML contract
 */
export interface DamlContract {
  id: string;
  templateId: string;
  argument: any;
  createTime: string;
  archived: boolean;
  choices?: DamlChoice[];
}

/**
 * Response from the contracts API
 */
export interface ContractsResponse {
  success: boolean;
  contracts: DamlContract[];
  metadata?: {
    count: number;
    source: string;
    templateBreakdown: Record<string, number>;
    timestamp: string;
    archivedContracts?: number;
    activeContracts?: number;
  };
}

/**
 * Service for interacting with contracts API
 */
export const ContractsService = {
  /**
   * Fetch all contracts from the backend API
   */
  async getAllContracts(): Promise<ContractsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contracts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },
};

export default ContractsService;
