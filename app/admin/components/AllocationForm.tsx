'use client';

import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { Delegate, Allocation } from '.././types';

interface AllocationFormProps {
  delegate: Delegate;
  committees: string[];
  getAvailableCountries: (committee: string) => string[];
  onAllocate: (delegateId: number, allocation: Allocation) => void;
  onEditAllocation: (delegateId: number, allocation: Allocation) => void;
  onDeleteAllocation: (delegateId: number) => void;
  isAllocated: boolean;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
  delegate,
  committees,
  getAvailableCountries,
  onAllocate,
  onEditAllocation,
  onDeleteAllocation,
  isAllocated,
}) => {
  const [committee, setCommittee] = useState(delegate.allocation?.committee || '');
  const [country, setCountry] = useState(delegate.allocation?.country || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleAllocate = () => {
    if (committee && country) {
      const allocation: Allocation = { committee, country };
      onAllocate(delegate.id, allocation);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    if (committee && country) {
      const allocation: Allocation = { committee, country };
      onEditAllocation(delegate.id, allocation);
      setIsEditing(false);
    }
  };

  const availableCountries = committee ? getAvailableCountries(committee) : [];

  return (
    <div className="space-y-4">
      {isAllocated && !isEditing ? (
        <div>
          <p><strong>Committee:</strong> {delegate.allocation?.committee}</p>
          <p><strong>Country:</strong> {delegate.allocation?.country}</p>
          <div className="mt-2 space-x-2">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => onDeleteAllocation(delegate.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex  gap-4 w-full pb-5">
            <Dropdown
              options={committees}
              value={committee}
              onChange={setCommittee}
              placeholder="Select Committee"
              className="w-full"
            />
            
            <Dropdown
              options={availableCountries.length > 0 ? availableCountries : ['All countries allocated']}
              value={country}
              onChange={setCountry}
              placeholder="Select Country"
              disabled={!committee || availableCountries.length === 0}
              className="w-full"
            />
          </div>
          
          <button
            className=" px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-900 disabled:bg-gray-400"
            onClick={isAllocated ? handleEdit : handleAllocate}
            disabled={!committee || !country}
          >
            {isAllocated ? 'Update Allocation' : 'Allocate'}
          </button>
        </>
      )}
    </div>
  );
};

export default AllocationForm;