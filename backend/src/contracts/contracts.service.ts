import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GRAPHQL_AUTH_COOKIE, DEFAULT_CONFIG } from '../common/constants';
import { DamlContract } from '../common/interfaces';



@Injectable()
export class ContractsService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get all contracts from the DAML ledger
   * @returns Array of DamlContract objects
   */
  async getAllContracts(): Promise<DamlContract[]> {
    try {
      console.log('ContractsService: Fetching all contracts via GraphQL API');
      return await this.getContractsViaGraphQL();
    } catch (error) {
      console.error('ContractsService: Error fetching contracts:', error.message);
      throw new HttpException(
        {
          message: 'Failed to fetch contracts',
          source: 'GraphQL API',
          timestamp: new Date().toISOString(),
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get contracts via the GraphQL API
   * This is the same approach used by the DAML Navigator UI
   */
  private async getContractsViaGraphQL(): Promise<DamlContract[]> {
    try {
      const graphqlEndpoint = `http://${this.configService.get<string>('daml.ledger.host') || DEFAULT_CONFIG.DAML.LEDGER.HOST}:${this.configService.get<number>('daml.ledger.graphqlPort') || DEFAULT_CONFIG.DAML.LEDGER.GRAPHQL_PORT}/api/graphql`;
      console.log(`Using GraphQL endpoint: ${graphqlEndpoint}`);
      
      // Using the query from the DAML Navigator
      const requestBody = {
        "operationName": "ContractsQuery",
        "variables": {
          "search": "",
          "filter": [],
          "includeArchived": false,
          "count": 100,
          "sort": []
        },
        "query": `query ContractsQuery($filter: [FilterCriterion!], $search: String!, $includeArchived: Boolean!, $count: Int!, $sort: [SortCriterion!]) {
          contracts(
            filter: $filter
            search: $search
            includeArchived: $includeArchived
            count: $count
            sort: $sort
          ) {
            totalCount
            edges {
              node {
                __typename
                id
                ... on Contract {
                  createEvent {
                    id
                    transaction {
                      effectiveAt
                      __typename
                    }
                    __typename
                  }
                  archiveEvent {
                    id
                    __typename
                  }
                  argument
                  template {
                    id
                    choices {
                      name
                      inheritedInterface
                      __typename
                    }
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
      
      console.log('Sending GraphQL request to fetch contracts...');
      
      // Use the same headers that worked for templates
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
      
      console.log(`GraphQL response received with status: ${response.status}`);
      
      if (!response.data || !response.data.data || !response.data.data.contracts) {
        console.error('Invalid GraphQL response format:', response.data);
        throw new Error('Invalid GraphQL response format');
      }
      
      const contractsData = response.data.data.contracts;
      console.log(`Found ${contractsData.totalCount} contracts`);
      
      // Transform the GraphQL response into our DamlContract interface
      const contracts: DamlContract[] = contractsData.edges.map(edge => {
        const node = edge.node;
        
        // Extract template ID from the template.id field
        const templateId = node.template ? node.template.id : 'Unknown';
        
        // Extract choices from the template.choices array
        const choices = node.template && node.template.choices 
          ? node.template.choices.map(choice => ({
              name: choice.name,
              inheritedInterface: choice.inheritedInterface || undefined
            }))
          : [];
        
        // Extract creation time from createEvent.transaction.effectiveAt
        const createTime = node.createEvent && node.createEvent.transaction 
          ? node.createEvent.transaction.effectiveAt 
          : new Date().toISOString();
        
        // Check if contract is archived
        const archived = !!node.archiveEvent;
        
        return {
          id: node.id,
          templateId,
          argument: node.argument,
          createTime,
          archived,
          choices
        };
      });
      
      console.log(`Processed ${contracts.length} contracts`);
      return contracts;
    } catch (error) {
      console.error('Error fetching contracts via GraphQL:', error);
      throw error;
    }
  }
}
