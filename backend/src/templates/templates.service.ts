import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// JWT tokens for DAML JSON API authentication
const ALICE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6IkhUVFAtSlNPTi1BUEktR2F0ZXdheSIsImFjdEFzIjpbIkFsaWNlIl19fQ.FIjS4ao9yu1XYnv1ZL3t7ooPNIyQYAHY3pmzej4EMCM';
const BOB_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6IkhUVFAtSlNPTi1BUEktR2F0ZXdheSIsImFjdEFzIjpbIkJvYiJdfX0.y6iwpnYt-ObtNo_FyLVxMtNTwpJF8uxzNfPELQUVKVg';

export interface DamlChoice {
  name: string;
  parameterType: string;
  returnType: string;
  controllers: string[];
}

export interface DamlTemplate {
  packageId: string;
  moduleName: string;
  entityName: string;
  templateId: string;
  choices: DamlChoice[];
}

@Injectable()
export class TemplatesService {
  private readonly damlJsonApiUrl: string;
  
  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('daml.ledger.host') || 'localhost';
    const httpPort = this.configService.get<number>('daml.ledger.httpPort') || 7575;
    this.damlJsonApiUrl = `http://${host}:${httpPort}`;
    console.log(`DAML JSON API URL: ${this.damlJsonApiUrl}`);
  }
  
  /**
   * Get all template definitions from the DAML JSON API
   * This dynamically discovers all templates by querying the DAML ledger
   */
  async getAllTemplateDefinitions(): Promise<DamlTemplate[]> {
    try {
      // Step 1: Get all packages from the DAML ledger with authentication
      const packagesResponse = await axios.get(`${this.damlJsonApiUrl}/v1/packages`, {
        headers: {
          'Authorization': `Bearer ${BOB_TOKEN}`,
        },
      });
      const packageIds = packagesResponse.data.result;
      
      // Step 2: Process each package to extract templates
      const templates: DamlTemplate[] = [];
      
      for (const packageId of packageIds) {
        try {
          // Get package details with authentication
          const packageResponse = await axios.get(`${this.damlJsonApiUrl}/v1/packages/${packageId}`, {
            headers: {
              'Authorization': `Bearer ${ALICE_TOKEN}`,
            },
          });
          const packageData = packageResponse.data;
          
          // Extract modules and templates
          if (packageData && packageData.modules) {
            for (const moduleName of Object.keys(packageData.modules)) {
              const module = packageData.modules[moduleName];
              
              // Process templates in this module
              if (module.templates) {
                for (const templateName of Object.keys(module.templates)) {
                  const template = module.templates[templateName];
                  
                  // Extract choices
                  const choices: DamlChoice[] = [];
                  if (template.choices) {
                    for (const choiceName of Object.keys(template.choices)) {
                      const choice = template.choices[choiceName];
                      choices.push({
                        name: choiceName,
                        parameterType: choice.parameterType || 'Unknown',
                        returnType: choice.returnType || 'Unknown',
                        controllers: choice.controllers || [],
                      });
                    }
                  }
                  
                  // Create template info
                  templates.push({
                    packageId,
                    moduleName,
                    entityName: templateName,
                    templateId: `${packageId}:${moduleName}:${templateName}`,
                    choices,
                  });
                }
              }
            }
          }
        } catch (packageError) {
          console.error(`Error processing package ${packageId}:`, packageError.message);
          // Continue with other packages even if one fails
        }
      }
      
      return templates;
    } catch (error) {
      console.error('Error fetching templates from DAML JSON API:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error config:', error.config);
      }
      throw new HttpException(
        `Failed to fetch templates from DAML JSON API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

}
