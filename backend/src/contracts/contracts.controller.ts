import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContractsService, DamlContract } from './contracts.service';

@ApiTags('contracts')
@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all DAML contracts', 
    description: 'Retrieves all active DAML contracts from the ledger using GraphQL API. Returns contract data including template ID, arguments, creation time, and available choices.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved contracts',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        contracts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '#1:0' },
              templateId: { type: 'string', example: 'Exchange:Token@daml-exchange-0.0.1' },
              argument: { 
                type: 'object', 
                example: { 
                  owner: 'Alice',
                  issuer: 'Bob',
                  amount: 100,
                  currency: 'USD'
                } 
              },
              createTime: { type: 'string', example: '2025-07-14T02:36:54.789Z' },
              archived: { type: 'boolean', example: false },
              choices: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Transfer' },
                    inheritedInterface: { type: 'string', example: null }
                  }
                }
              }
            }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 5 },
            source: { type: 'string', example: 'GraphQL API' },
            templateBreakdown: { type: 'object', example: { 'Exchange:Token': 3, 'Exchange:Account': 2 } },
            timestamp: { type: 'string', example: '2025-07-14T02:36:54.789Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Failed to fetch contracts' },
        source: { type: 'string', example: 'GraphQL API' },
        timestamp: { type: 'string', example: '2025-07-14T02:36:54.789Z' },
        details: { type: 'object', example: { error: 'Connection refused' } }
      }
    }
  })
  async getAllContracts(): Promise<{ success: boolean; contracts: DamlContract[]; metadata?: any }> {
    try {
      console.log('Contracts controller: getAllContracts called');
      
      // Get contracts from the service
      const contracts = await this.contractsService.getAllContracts();
      
      // Add metadata about the contracts for debugging and client information
      const metadata = {
        count: contracts.length,
        source: 'GraphQL API',
        templateBreakdown: {},
        timestamp: new Date().toISOString()
      };
      
      // Count contracts by template
      contracts.forEach(contract => {
        if (!metadata.templateBreakdown[contract.templateId]) {
          metadata.templateBreakdown[contract.templateId] = 0;
        }
        metadata.templateBreakdown[contract.templateId]++;
      });
      
      // Add additional contract statistics if available
      if (contracts.length > 0) {
        // Count archived contracts
        const archivedContracts = contracts.filter(c => c.archived).length;
        metadata['archivedContracts'] = archivedContracts;
        
        // Count active contracts
        metadata['activeContracts'] = contracts.length - archivedContracts;
      }
      
      console.log(`Contracts controller: Returning ${contracts.length} contracts from GraphQL API`);
      return {
        success: true,
        contracts,
        metadata
      };
    } catch (error) {
      console.error('Contracts controller: Error fetching contracts:', error);
      
      // Throw a more detailed error response
      throw new HttpException(
        {
          message: error.message || 'Failed to fetch contracts',
          source: 'GraphQL API',
          timestamp: new Date().toISOString(),
          details: error.response || error
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
