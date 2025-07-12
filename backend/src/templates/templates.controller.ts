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
  async getAllTemplates(): Promise<{ success: boolean; templates: DamlTemplate[] }> {
    try {
      const templates = await this.templatesService.getAllTemplateDefinitions();
      return {
        success: true,
        templates,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch templates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
