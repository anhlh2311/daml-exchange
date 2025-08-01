import React from 'react';
import { DamlTemplate } from '@/services/templates';

interface TemplatesListProps {
  templates: DamlTemplate[];
}

export default function TemplatesList({ templates }: TemplatesListProps) {
  // Group templates by module
  const templatesByModule = templates.reduce<Record<string, DamlTemplate[]>>((acc, template) => {
    const module = template.moduleName;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(template);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      
      {/* Templates by Module */}
      {Object.entries(templatesByModule).map(([module, moduleTemplates]) => (
        <div key={module} className="overflow-hidden bg-white shadow sm:rounded-md">
          <div className="bg-indigo-600 px-4 py-2">
            <h3 className="text-lg font-medium text-white">{module}: {moduleTemplates.length} template(s)</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {moduleTemplates.map((template) => (
              <li key={template.templateId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-indigo-600">
                      {template.entityName}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {template.contractCount || 0} contract{template.contractCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="overflow-x-auto">
                      <p className="text-sm text-gray-500 whitespace-nowrap pb-1">
                        <span className="font-medium">Full ID:</span> {template.moduleName}:{template.entityName}@{template.packageId}
                      </p>
                    </div>
                  </div>
                  
                  {template.choices.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">Available Choices:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {template.choices.map((choice) => (
                          <span 
                            key={choice.name} 
                            className="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                            title={`Controllers: ${choice.controllers.join(', ')}`}
                          >
                            {choice.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
