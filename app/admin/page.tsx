'use client';

import React, { useState } from 'react';
import Tabs from './components/Tabs';
import FilterBar from './components/FilterBar';
import DelegateCard from './components/DelegateCard';
import { Delegate, Allocation } from './types';

const dummyData: Delegate[] = [
  {
    id: 1,
    name: "Swetha",
    email: "swetha@example.com",
    phone: "123-456-7890",
    institution: "ABC College",
    internal: true,
    uploads: { paymentProof: "/dummyImage.png" },
    allocation: null,
  },
  {
    id: 2,
    name: "Rahul",
    email: "rahul@example.com",
    phone: "987-654-3210",
    institution: "XYZ University",
    internal: false,
    uploads: { paymentProof: "/dummyImage.png" },
    allocation: { committee: "UNSC", country: "India" },
  },
   {
    id: 3,
    name: "Aadhira",
    email: "aadhira@example.com",
    phone: "123-456-7890",
    institution: "ABC College",
    internal: true,
    uploads: { paymentProof: "/dummyImage.png" },
    allocation: null,
  },
  {
    id: 4,
    name: "Shreya",
    email: "shreya@example.com",
    phone: "987-654-3210",
    institution: "RTY University",
    internal: false,
    uploads: { paymentProof: "/dummyImage.png" },
    allocation:null,
  },
];

const committees = ["UNSC", "UNGA", "WHO"];
const countriesByCommittee: { [key: string]: string[] } = {
  UNSC: ["India", "USA", "China", "Russia"],
  UNGA: ["Brazil", "Germany", "Japan", "France"],
  WHO: ["Canada", "Australia", "South Africa", "UK"],
};

const AdminDashboard: React.FC = () => {
  const [delegates, setDelegates] = useState<Delegate[]>(dummyData);
  const [activeTab, setActiveTab] = useState<'Unallocated' | 'Allocated'>('Unallocated');
  const [filter, setFilter] = useState<'All' | 'Internal' | 'External'>('All');

  const handleAllocate = (delegateId: number, allocation: Allocation) => {
    setDelegates((prev) =>
      prev.map((delegate) =>
        delegate.id === delegateId ? { ...delegate, allocation } : delegate
      )
    );
  };

  const handleEditAllocation = (delegateId: number, allocation: Allocation) => {
    setDelegates((prev) =>
      prev.map((delegate) =>
        delegate.id === delegateId ? { ...delegate, allocation } : delegate
      )
    );
  };

  const handleDeleteAllocation = (delegateId: number) => {
    setDelegates((prev) =>
      prev.map((delegate) =>
        delegate.id === delegateId ? { ...delegate, allocation: null } : delegate
      )
    );
  };

  const filteredDelegates = delegates.filter((delegate) => {
    if (filter === 'Internal') return delegate.internal;
    if (filter === 'External') return !delegate.internal;
    return true;
  }).filter((delegate) =>
    activeTab === 'Unallocated' ? !delegate.allocation : delegate.allocation
  );

  const getAvailableCountries = (committee: string) => {
    const allocatedCountries = delegates
      .filter((d) => d.allocation?.committee === committee)
      .map((d) => d.allocation?.country)
      .filter((country): country is string => !!country);
    return countriesByCommittee[committee]?.filter(
      (country) => !allocatedCountries.includes(country)
    ) || [];
  };

  const unallocatedCount = delegates.filter((d) => !d.allocation).length;
  const allocatedCount = delegates.filter((d) => d.allocation).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-140 to-blue-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="relative">
              <img
                src="/images/AMUN25_Logo.png"
                alt="Admin Profile"
                className="w-14 h-14 rounded-full mr-4 border-4 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
              <p className="text-xl font-bold text-blue-600">Welcome back</p>
            </div>
          </div>
        </header>

        {/* Stats Cards - Moved below header */}
        <div className="flex space-x-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 min-w-[120px] flex-1">
            <p className="text-sm text-blue-700 font-bold">Total Delegates</p>
            <p className="text-2xl font-bold text-blue-900">{delegates.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 min-w-[120px] flex-1">
            <p className="text-sm text-blue-700 font-bold">Unallocated</p>
            <p className="text-2xl font-bold text-blue-900">{unallocatedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 min-w-[120px] flex-1">
            <p className="text-sm text-blue-700 font-bold">Allocated</p>
            <p className="text-2xl font-bold text-blue-900">{allocatedCount}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-blue-50">
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              unallocatedCount={unallocatedCount}
            />
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <FilterBar filter={filter} setFilter={setFilter} />
            </div>
          </div>
          
          {/* Delegate Cards */}
          <div className="p-6">
            {filteredDelegates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-blue-900 mb-1">No delegates found</h3>
                <p className="text-blue-500 text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDelegates.map((delegate) => (
                  <DelegateCard
                    key={delegate.id}
                    delegate={delegate}
                    committees={committees}
                    getAvailableCountries={getAvailableCountries}
                    onAllocate={handleAllocate}
                    onEditAllocation={handleEditAllocation}
                    onDeleteAllocation={handleDeleteAllocation}
                    isAllocated={activeTab === 'Allocated'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;