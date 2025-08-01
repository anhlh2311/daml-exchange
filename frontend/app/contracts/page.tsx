'use client';

import { useEffect, useState } from 'react';
import { ContractsService, DamlContract } from '../../services/contracts';
import ContractsList from '../../components/contracts/ContractsList';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<DamlContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    async function fetchContracts() {
      try {
        setLoading(true);
        const response = await ContractsService.getAllContracts();
        
        if (response.success) {
          setContracts(response.contracts);
          setMetadata(response.metadata);
        } else {
          setError('Failed to fetch contracts');
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
        setError('An error occurred while fetching contracts');
      } finally {
        setLoading(false);
      }
    }

    fetchContracts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-lg">Loading contracts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">DAML Contracts</h1>
      
      {metadata && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Contracts Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Contracts</p>
              <p className="text-xl font-medium">{metadata.count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-xl font-medium">{metadata.activeContracts || metadata.count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-sm">
                {new Date(metadata.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {contracts.length > 0 ? (
        <ContractsList contracts={contracts} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <p>No contracts found. Create a contract to get started.</p>
        </div>
      )}
    </div>
  );
}
