import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MainLayout from '@/components/layout/MainLayout';

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome to your DAML Token Exchange dashboard. Monitor your tokens, transactions, and exchange activities.
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Token Holdings</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Your current token balances.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">$</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">USD Token</h4>
                        <p className="text-xs text-gray-500">US Dollar</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">1,000</p>
                      <p className="text-xs text-gray-500">$1,000.00</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">€</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">EUR Token</h4>
                        <p className="text-xs text-gray-500">Euro</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">500</p>
                      <p className="text-xs text-gray-500">€500.00</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-bold">£</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">GBP Token</h4>
                        <p className="text-xs text-gray-500">British Pound</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">250</p>
                      <p className="text-xs text-gray-500">£250.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <a
                    href="#"
                    className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    View All Tokens
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
