"use client";

import React, { useEffect, useState } from 'react';
import { fetchTemplates, DamlTemplate } from '@/services/templates';
import MainLayout from '@/components/layout/MainLayout';
import TemplatesList from '@/components/templates/TemplatesList';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DamlTemplate[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Group templates by module
  const templatesByModule: Record<string, DamlTemplate[]> = templates.reduce((acc, template) => {
    const module = template.moduleName;
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(template);
    return acc;
  }, {} as Record<string, DamlTemplate[]>);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        const response = await fetchTemplates();
        setTemplates(response.templates);
        setMetadata(response.metadata);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load templates:', err);
        setError('Failed to load templates. Please try again later.');
        setLoading(false);
      }
    }

    loadTemplates();
  }, []);

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">DAML Templates</h1>
          
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-gray-600">Loading templates...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* Templates List Component */}
              <div className="mt-6">
                <TemplatesList templates={templates} />
              </div>
              
              {/* Metadata */}
              {metadata && (
                <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Metadata</h3>
                    <div className="mt-5 border-t border-gray-200">
                      <dl className="divide-y divide-gray-200">
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500">Total Templates</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{metadata.count}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500">Data Source</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{metadata.source}</dd>
                        </div>
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {new Date(metadata.timestamp).toLocaleString()}
                          </dd>
                        </div>
                        {metadata.templatesWithContracts !== undefined && (
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500">Templates With Active Contracts</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              {metadata.templatesWithContracts}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
