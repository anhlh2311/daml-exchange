import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TemplatesService, DamlTemplate } from './templates.service';

@ApiTags('templates')
@Controller('api/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all DAML templates', 
    description: 'Retrieves all DAML templates from the ledger using GraphQL API. Returns template metadata including package information, module names, entity names, and contract counts.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved templates',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        templates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              packageId: { type: 'string', example: 'daml-exchange-0.0.1' },
              moduleName: { type: 'string', example: 'Exchange' },
              entityName: { type: 'string', example: 'Token' },
              templateId: { type: 'string', example: 'Exchange:Token@daml-exchange-0.0.1' },
              contractCount: { type: 'number', example: 5 },
              choices: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Transfer' },
                    parameterType: { type: 'string', example: 'TransferParams' },
                    returnType: { type: 'string', example: 'ContractId Token' },
                    controllers: { type: 'array', items: { type: 'string' }, example: ['owner'] }
                  }
                }
              }
            }
          }
        },
        metadata: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 10 },
            source: { type: 'string', example: 'GraphQL API' },
            moduleBreakdown: { type: 'object', example: { 'Exchange': 5, 'Main': 3, 'User': 2 } },
            timestamp: { type: 'string', example: '2025-07-13T08:34:36.789Z' },
            templatesWithContracts: { type: 'number', example: 3 }
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
        message: { type: 'string', example: 'Failed to fetch templates' },
        source: { type: 'string', example: 'GraphQL API' },
        timestamp: { type: 'string', example: '2025-07-13T08:34:36.789Z' },
        details: { type: 'object', example: { error: 'Connection refused' } }
      }
    }
  })
  async getAllTemplates(): Promise<{ success: boolean; templates: DamlTemplate[]; metadata?: any }> {
    try {
      console.log('Templates controller: getAllTemplates called');
      
      // Get templates from the service (now using GraphQL exclusively)
      const templates = await this.templatesService.getAllTemplateDefinitions();
      
      // Add metadata about the templates for debugging and client information
      const metadata = {
        count: templates.length,
        source: 'GraphQL API',
        moduleBreakdown: {},
        timestamp: new Date().toISOString()
      };
      
      // Count templates by module
      templates.forEach(template => {
        if (!metadata.moduleBreakdown[template.moduleName]) {
          metadata.moduleBreakdown[template.moduleName] = 0;
        }
        metadata.moduleBreakdown[template.moduleName]++;
      });
      
      // Add additional template statistics if available
      if (templates.length > 0) {
        // Count templates with contracts
        const templatesWithContracts = templates.filter(t => t.contractCount && t.contractCount > 0).length;
        metadata['templatesWithContracts'] = templatesWithContracts;
      }
      
      console.log(`Templates controller: Returning ${templates.length} templates from GraphQL API`);
      return {
        success: true,
        templates,
        metadata
      };
    } catch (error) {
      console.error('Templates controller error:', error);
      
      // Improved error handling with more detailed information
      const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        message: error.message || 'Failed to fetch templates',
        source: 'GraphQL API',
        timestamp: new Date().toISOString()
      };
      
      // Add response data if available
      if (error.response?.data) {
        errorResponse['details'] = error.response.data;
      }
      
      throw new HttpException(errorResponse, statusCode);
    }
  }
}
