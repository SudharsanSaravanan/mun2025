'use client';

import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { Allocation } from '../types/types';
import ConfirmationModal from './ConfirmationBox';

interface Committee {
  id: string;
  name: string;
  is_double_delegation: boolean;
}

interface Country {
  id: string;
  name: string;
}

interface AllocationFormProps {
  delegate: {
    id: string;
    name: string;
    allocation: {
      role: 'delegate' | 'IP';
      ip_subrole?: 'reporter' | 'photojournalist';
      committee: string;
      country: string;
      is_double_delegation: boolean;
    } | null;
    is_internal: boolean;
    preferences: any[];
  };
  committees: Committee[];
  getAvailableCountries: (committeeId: string) => Country[];
  onAllocate: (allocation: Omit<Allocation, 'allocated_at'>) => Promise<void>;
  onEditAllocation: (allocation: Omit<Allocation, 'allocated_at'>) => Promise<void>;
  onDeleteAllocation: () => Promise<void>;
  isAllocated: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
  delegate,
  committees,
  getAvailableCountries,
  onAllocate,
  onEditAllocation,
  onDeleteAllocation,
  isAllocated,
  setIsEditing,
}) => {
  const [role, setRole] = useState<'delegate' | 'IP'>(delegate.allocation?.role || 'delegate');
  const [committee, setCommittee] = useState(delegate.allocation?.committee || '');
  const [country, setCountry] = useState(delegate.allocation?.country || '');
  const [ipSubrole, setIpSubrole] = useState<'reporter' | 'photojournalist'>(delegate.allocation?.ip_subrole || 'reporter');
  const [isDoubleDelegation, setIsDoubleDelegation] = useState(delegate.allocation?.is_double_delegation || false);
  const [confirmType, setConfirmType] = useState<'allocate' | 'edit' | 'delete' | null>(null);

  const availableCountries: Country[] = committee ? getAvailableCountries(committee) : [];
  const selectedCommittee = committees.find(c => c.id === committee);
  const showDoubleDelegation = role === 'delegate' && selectedCommittee?.is_double_delegation;

  const handleAllocate = async () => {
    const allocation: Omit<Allocation, 'allocated_at'> = {
      user_id: delegate.id,
      role,
      ip_subrole: role === 'IP' ? ipSubrole : null,
      committee_id: role === 'delegate' ? committee : null,
      country_id: role === 'delegate' ? country : null,
      is_double_delegation: role === 'delegate' ? isDoubleDelegation : false
    };
    await onAllocate(allocation);
  };

  const handleEdit = async () => {
    const allocation: Omit<Allocation, 'allocated_at'> = {
      user_id: delegate.id,
      role,
      ip_subrole: role === 'IP' ? ipSubrole : null,
      committee_id: role === 'delegate' ? committee : null,
      country_id: role === 'delegate' ? country : null,
      is_double_delegation: role === 'delegate' ? isDoubleDelegation : false
    };
    await onEditAllocation(allocation);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full pb-5 text-sm">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded text-sm ${role === 'delegate' ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setRole('delegate')}
          >
            Delegate
          </button>
          <button
            className={`px-4 py-2 rounded text-sm ${role === 'IP' ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setRole('IP')}
          >
            IP
          </button>
        </div>

        {role === 'delegate' ? (
          <>
            <Dropdown
              options={committees.map((c) => ({ id: c.id, name: c.name }))}
              value={committee}
              onChange={setCommittee}
              placeholder="Select Committee"
              className="w-full text-sm"
            />
            {committee && (
              <Dropdown
                options={availableCountries.length > 0
                  ? [{ id: '', name: 'Select Country' }, ...availableCountries.map(c => ({ id: c.id, name: c.name }))]
                  : [{ id: '', name: 'All countries allocated' }]
                }
                value={country}
                onChange={setCountry}
                placeholder="Select Country"
                disabled={!committee || availableCountries.length === 0}
                className="w-full text-sm"
              />
            )}
            {showDoubleDelegation && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="doubleDelegation"
                  checked={isDoubleDelegation}
                  onChange={(e) => setIsDoubleDelegation(e.target.checked)}
                />
                <label htmlFor="doubleDelegation">Double Delegation</label>
              </div>
            )}
          </>
        ) : (
          <Dropdown
            options={[
              { id: 'reporter', name: 'Reporter' },
              { id: 'photojournalist', name: 'Photojournalist' },
            ]}
            value={ipSubrole}
            onChange={(value) => setIpSubrole(value as 'reporter' | 'photojournalist')}
            placeholder="Select IP Role"
            className="w-full text-sm"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="px-3 py-2 bg-[#1c398e] text-white rounded hover:bg-[#1c398e] hover:cursor-pointer disabled:bg-gray-400 text-sm"
          onClick={() => setConfirmType(isAllocated ? 'edit' : 'allocate')}
          disabled={role === 'delegate' ? (!committee || !country) : false}
        >
          {isAllocated ? 'Update Allocation' : 'Allocate'}
        </button>
        {isAllocated && (
          <button
            className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 hover:cursor-pointer text-sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmType !== null}
        message={
          confirmType === 'allocate'
            ? `Are you sure you want to allocate this user?`
            : confirmType === 'edit'
            ? `Are you sure you want to update this user's allocation?`
            : `Are you sure you want to delete this user's allocation?`
        }
        onClose={() => setConfirmType(null)}
        onConfirm={async () => {
          if (confirmType === 'allocate') await handleAllocate();
          else if (confirmType === 'edit') await handleEdit();
          else if (confirmType === 'delete') await onDeleteAllocation();
        }}
      />
    </>
  );
};

export default AllocationForm;