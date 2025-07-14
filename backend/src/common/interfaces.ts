/**
 * Common interfaces for DAML entities used across the application
 */

/**
 * Represents a choice available on a DAML template
 */
export interface DamlChoice {
  name: string;
  parameterType?: string;
  returnType?: string;
  controllers?: string[];
  inheritedInterface?: string;
}

/**
 * Represents a DAML template definition
 */
export interface DamlTemplate {
  packageId: string;
  moduleName: string;
  entityName: string;
  templateId: string;
  choices: DamlChoice[];
  contractCount?: number; // Optional count of contracts for this template
}

/**
 * Represents a DAML contract instance
 */
export interface DamlContract {
  id: string;
  templateId: string;
  argument: any;
  createTime: string;
  archived: boolean;
  choices?: DamlChoice[];
}
