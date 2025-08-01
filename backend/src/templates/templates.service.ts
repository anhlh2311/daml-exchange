import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DAML_TOKENS, GRAPHQL_AUTH_COOKIE, API_ENDPOINTS, DEFAULT_CONFIG } from '../common/constants';
import { DamlTemplate, DamlChoice } from '../common/interfaces';



@Injectable()
export class TemplatesService {
  private readonly damlJsonApiUrl: string;
  private readonly graphqlApiUrl: string;
  
  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('daml.ledger.host') || 'localhost';
    const httpPort = this.configService.get<number>('daml.ledger.httpPort') || 7575;
    const graphqlPort = this.configService.get<number>('daml.ledger.graphqlPort') || 7500;
    
    this.damlJsonApiUrl = `http://${host}:${httpPort}`;
    this.graphqlApiUrl = `http://${host}:${graphqlPort}/api/graphql`;
    
    console.log(`DAML JSON API URL: ${this.damlJsonApiUrl}`);
    console.log(`DAML GraphQL API URL: ${this.graphqlApiUrl}`);
  }
  
  /**
   * Get all template definitions from the DAML ledger
   * This dynamically discovers all templates by querying the DAML ledger
   */
  async getAllTemplateDefinitions(): Promise<DamlTemplate[]> {
    try {
      console.log('Fetching templates from DAML ledger...');
      
      // First try to get templates via GraphQL API as it's more reliable
      const graphqlTemplates = await this.getTemplatesViaGraphQL();
      
      if (graphqlTemplates.length > 0) {
        console.log(`Successfully retrieved ${graphqlTemplates.length} templates from GraphQL API`);
        return graphqlTemplates;
      }     
      
      console.log('No templates found from either API');
      return [];
    } catch (error) {
      console.error('Error in getAllTemplateDefinitions:', error.message);
      throw new HttpException(
        `Failed to fetch templates: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  /**
   * Get templates via the GraphQL API
   * This is often more reliable as it's what the DAML Navigator UI uses
   */
  private async getTemplatesViaGraphQL(): Promise<DamlTemplate[]> {
    try {
      const graphqlEndpoint = `http://${this.configService.get<string>('daml.ledger.host') || 'localhost'}:7500/api/graphql`;
      console.log(`Using GraphQL endpoint: ${graphqlEndpoint}`);
      
      // Using the query that worked in graphql_requests.js
      const requestBody = {
        "operationName": "TemplatesQuery",
        "variables": {
          "search": "",
          "filter": [],
          "count": 100,
          "sort": []
        },
        "query": `query TemplatesQuery($filter: [FilterCriterion!], $search: String!, $count: Int!, $sort: [SortCriterion!]) {
          templates(search: $search, filter: $filter, count: $count, sort: $sort) {
            totalCount
            edges {
              node {
                __typename
                id
                implementedInterfaces
                ... on Template {
                  topLevelDecl
                  contracts {
                    totalCount
                    __typename
                  }
                  __typename
                }
              }
              __typename
            }
            __typename
          }
        }`
      };
      
      console.log('Sending GraphQL request to fetch templates...');
      
      // Use the same headers that worked in the JavaScript file
      const response = await axios.post(graphqlEndpoint, requestBody, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,vi;q=0.8,ja;q=0.7",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          // Include the cookie for authentication
          "cookie": GRAPHQL_AUTH_COOKIE
        }
      });
      
      console.log('GraphQL response status:', response.status);
      
      // Process the response
      if (response.data && response.data.data && response.data.data.templates && response.data.data.templates.edges) {
        const templates: DamlTemplate[] = [];
        const edges = response.data.data.templates.edges;
        console.log(`Found ${edges.length} templates via GraphQL`);
        
        // Transform GraphQL template format to our DamlTemplate format
        for (const edge of edges) {
          const node = edge.node;
          if (node.__typename === 'Template') {
            // Extract package ID and module name from topLevelDecl
            // Format is typically ModuleName:EntityName
            const parts = node.topLevelDecl ? node.topLevelDecl.split(':') : [];
            const moduleName = parts.length > 0 ? parts[0] : 'Unknown';
            const entityName = parts.length > 1 ? parts[1] : node.topLevelDecl || 'Unknown';
            
            // Extract packageId from the template ID
            // Format is typically TemplateName@PackageId
            const idParts = node.id ? node.id.split('@') : [];
            const packageId = idParts.length > 1 ? idParts[1] : 'Unknown';
            
            // Get contract count if available
            const contractCount = node.contracts && node.contracts.totalCount !== undefined 
              ? node.contracts.totalCount 
              : 0;
              
            templates.push({
              packageId,
              moduleName,
              entityName,
              templateId: node.id,
              choices: [], // We don't have choice information in this response
              contractCount // Add contract count for informational purposes
            });
          }
        }
        
        console.log(`Processed ${templates.length} templates`);
        return templates;
      }
      
      console.log('No templates found in GraphQL response');
      return [];
    } catch (error) {
      console.error('Error fetching templates via GraphQL:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received. Is the GraphQL endpoint running?');
      }
      return []; // Return empty array to allow fallback
    }
  }

}
