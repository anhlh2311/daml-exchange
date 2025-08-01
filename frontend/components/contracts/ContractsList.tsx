import React, { useState } from 'react';
import { DamlContract } from '../../services/contracts';

interface ContractsListProps {
  contracts: DamlContract[];
}

export default function ContractsList({ contracts }: ContractsListProps) {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  // Group contracts by template ID for better organization
  const contractsByTemplate = contracts.reduce((acc, contract) => {
    const templateId = contract.templateId;
    if (!acc[templateId]) {
      acc[templateId] = [];
    }
    acc[templateId].push(contract);
    return acc;
  }, {} as Record<string, DamlContract[]>);

  const toggleExpand = (contractId: string) => {
    if (expandedContract === contractId) {
      setExpandedContract(null);
    } else {
      setExpandedContract(contractId);
    }
  };

  // Extract template name from templateId for display
  const getTemplateDisplayName = (templateId: string) => {
    // Format: Module:Entity@PackageId
    const match = templateId.match(/([^:]+):([^@]+)@/);
    if (match) {
      return `${match[1]}.${match[2]}`;
    }
    return templateId;
  };

  return (
    <div>
      {Object.entries(contractsByTemplate).map(([templateId, templateContracts]) => (
        <div key={templateId} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            {getTemplateDisplayName(templateId)}
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({templateContracts.length} contracts)
            </span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templateContracts.map((contract) => (
                  <React.Fragment key={contract.id}>
                    <tr 
                      className={`hover:bg-gray-50 ${contract.archived ? 'bg-gray-100 text-gray-500' : ''}`}
                      onClick={() => toggleExpand(contract.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <span className={`mr-2 ${expandedContract === contract.id ? 'transform rotate-90' : ''}`}>
                            ▶
                          </span>
                          <div className="max-w-xs overflow-hidden text-ellipsis">
                            {contract.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(contract.createTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {contract.archived ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Archived
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {!contract.archived && contract.choices && contract.choices.length > 0 && (
                          <div className="flex space-x-2">
                            {contract.choices.slice(0, 2).map(choice => (
                              <span 
                                key={choice.name}
                                className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Will implement exercise choice functionality later
                                  alert(`Exercise ${choice.name} on contract ${contract.id}`);
                                }}
                              >
                                {choice.name}
                              </span>
                            ))}
                            {contract.choices.length > 2 && (
                              <span className="px-2 py-1 text-xs rounded bg-gray-50 text-gray-700">
                                +{contract.choices.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedContract === contract.id && (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 bg-gray-50">
                          <div className="mb-2">
                            <span className="text-sm font-medium">Template ID:</span>
                            <div className="text-sm text-gray-700 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                              {contract.templateId}
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <span className="text-sm font-medium">Arguments:</span>
                            <pre className="text-sm text-gray-700 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                              {JSON.stringify(contract.argument, null, 2)}
                            </pre>
                          </div>
                          
                          {contract.choices && contract.choices.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Available Choices:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {contract.choices.map(choice => (
                                  <span 
                                    key={choice.name}
                                    className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100"
                                    onClick={() => {
                                      // Will implement exercise choice functionality later
                                      alert(`Exercise ${choice.name} on contract ${contract.id}`);
                                    }}
                                  >
                                    {choice.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
