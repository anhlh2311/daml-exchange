import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
    this.damlJsonApiUrl = this.configService.get<string>('daml.jsonApiUrl') || 'http://localhost:7575';
  }
  
  /**
   * Get all template definitions from the DAML JSON API
   * This dynamically discovers all templates by querying the DAML ledger
   */
  async getAllTemplateDefinitions(): Promise<DamlTemplate[]> {
    try {
      // Step 1: Get all packages from the DAML ledger
      const packagesResponse = await axios.get(`${this.damlJsonApiUrl}/v1/packages`);
      const packageIds = packagesResponse.data.result;
      
      // Step 2: Process each package to extract templates
      const templates: DamlTemplate[] = [];
      
      for (const packageId of packageIds) {
        try {
          // Get package details
          const packageResponse = await axios.get(`${this.damlJsonApiUrl}/v1/packages/${packageId}`);
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
      console.log('Using fallback mock templates data');
      return this.getMockTemplates();
    }
  }
  
  /**
   * Fallback method that returns mock template data
   * Used when the DAML JSON API is not available
   */
  private getMockTemplates(): DamlTemplate[] {
    return [
      {
        packageId: 'exchange-0.0.1',
        moduleName: 'Currency',
        entityName: 'TokenLedger',
        templateId: 'exchange-0.0.1:Currency:TokenLedger',
        choices: [
          {
            name: 'Transfer',
            parameterType: 'TransferParams',
            returnType: 'ContractId TokenLedger',
            controllers: ['issuer'],
          },
          {
            name: 'Burn',
            parameterType: 'Unit',
            returnType: 'ContractId TokenLedger',
            controllers: ['issuer'],
          },
        ],
      },
      {
        packageId: 'exchange-0.0.1',
        moduleName: 'Currency',
        entityName: 'TokenMetadata',
        templateId: 'exchange-0.0.1:Currency:TokenMetadata',
        choices: [
          {
            name: 'Archive',
            parameterType: 'Unit',
            returnType: 'Unit',
            controllers: ['issuer'],
          },
        ],
      },
      {
        packageId: 'exchange-0.0.1',
        moduleName: 'Exchange',
        entityName: 'TokenPair',
        templateId: 'exchange-0.0.1:Exchange:TokenPair',
        choices: [
          {
            name: 'Archive',
            parameterType: 'Unit',
            returnType: 'Unit',
            controllers: ['exchange'],
          },
        ],
      },
      {
        packageId: 'exchange-0.0.1',
        moduleName: 'Exchange',
        entityName: 'TokenSwap',
        templateId: 'exchange-0.0.1:Exchange:TokenSwap',
        choices: [
          {
            name: 'Accept',
            parameterType: 'Unit',
            returnType: 'ContractId TokenSwapResult',
            controllers: ['counterparty'],
          },
          {
            name: 'Cancel',
            parameterType: 'Unit',
            returnType: 'Unit',
            controllers: ['initiator'],
          },
        ],
      },
      {
        packageId: 'exchange-0.0.1',
        moduleName: 'Registry',
        entityName: 'PartyRegistry',
        templateId: 'exchange-0.0.1:Registry:PartyRegistry',
        choices: [
          {
            name: 'AddParty',
            parameterType: 'AddPartyParams',
            returnType: 'ContractId PartyRegistry',
            controllers: ['operator'],
          },
          {
            name: 'RemoveParty',
            parameterType: 'RemovePartyParams',
            returnType: 'ContractId PartyRegistry',
            controllers: ['operator'],
          },
        ],
      },
    ];
  }
}
