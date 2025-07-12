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
      
      // console.log('Packages response:', JSON.stringify(packagesResponse.data, null, 2));
      const packageIds = packagesResponse.data.result || [];
      console.log(`Found ${packageIds.length} packages:`, packageIds);
      
      // Step 2: Process each package to extract templates
      const templates: DamlTemplate[] = [];
      
      for (const packageId of packageIds) {
        try {
          // Get package details with authentication
          console.log(`Fetching details for package: ${packageId}`);
          const packageResponse = await axios.get(`${this.damlJsonApiUrl}/v1/packages/${packageId}`, {
            headers: {
              'Authorization': `Bearer ${ALICE_TOKEN}`,
            },
          });
          const packageData = packageResponse.data;
          
          // Log package structure
          console.log(`Package ${packageId} structure:`);
          console.log('- Has modules:', packageData && packageData.modules ? Object.keys(packageData.modules).length : 0);
          if (packageData && packageData.modules) {
            const moduleNames = Object.keys(packageData.modules);
            // console.log('- Module names:', moduleNames);
            
            // Log first module structure as example
            if (moduleNames.length > 0) {
              const firstModule = packageData.modules[moduleNames[0]];
              // console.log(`- First module '${moduleNames[0]}' structure:`, Object.keys(firstModule));
              // console.log('- Has templates:', firstModule.templates ? Object.keys(firstModule.templates).length : 0);
              
              // Log first template if available
              if (firstModule.templates) {
                const templateNames = Object.keys(firstModule.templates);
                if (templateNames.length > 0) {
                  const firstTemplate = firstModule.templates[templateNames[0]];
                  // console.log(`- First template '${templateNames[0]}' structure:`, Object.keys(firstTemplate));
                  // console.log('- Has choices:', firstTemplate.choices ? Object.keys(firstTemplate.choices).length : 0);
                }
              }
            }
          }
          
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
