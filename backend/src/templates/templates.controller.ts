import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TemplatesService, DamlTemplate } from './templates.service';

@ApiTags('templates')
@Controller('api/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all DAML templates' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all DAML templates',
    type: Array 
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
