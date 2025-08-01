import axios from 'axios';

// API base URL - make sure this matches your backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// Interface for DAML Choice
export interface DamlChoice {
  name: string;
  parameterType: string;
  returnType: string;
  controllers: string[];
}

// Interface for DAML Template
export interface DamlTemplate {
  packageId: string;
  moduleName: string;
  entityName: string;
  templateId: string;
  choices: DamlChoice[];
  contractCount?: number;
}

// Interface for the response from the templates API
interface TemplatesResponse {
  success: boolean;
  templates: DamlTemplate[];
  metadata?: {
    count: number;
    source: string;
    moduleBreakdown: Record<string, number>;
    timestamp: string;
    templatesWithContracts?: number;
  };
}

/**
 * Fetch templates from the backend API
 * @returns Promise with array of DamlTemplate objects and metadata
 */
export async function fetchTemplates(): Promise<TemplatesResponse> {
  try {
    const response = await axios.get<TemplatesResponse>(`${API_BASE_URL}/templates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}
