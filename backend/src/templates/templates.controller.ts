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
      const templates = await this.templatesService.getAllTemplateDefinitions();
      
      // Add metadata about the templates for debugging
      const metadata = {
        count: templates.length,
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
      
      console.log(`Templates controller: Returning ${templates.length} templates`);
      return {
        success: true,
        templates,
        metadata
      };
    } catch (error) {
      console.error('Templates controller error:', error);
      throw new HttpException(
        {
          message: error.message || 'Failed to fetch templates',
          details: error.response?.data || 'No additional details available'
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
