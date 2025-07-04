'use client';

import React, { useState } from 'react';
import Dropdown from './Dropdown';
import { Allocation } from '../types/types';
import ConfirmationModal from './ConfirmationBox';

interface Committee {
  id: string;
  name: string;
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
      committee: string;
      country: string;
    } | null;
    is_internal: boolean;
  };
  committees: Committee[];
  getAvailableCountries: (committeeId: string) => Country[];
  onAllocate: (allocation: Omit<Allocation, 'allocated_at'>) => void;
  onEditAllocation: (allocation: Omit<Allocation, 'allocated_at'>) => void;
  onDeleteAllocation: () => void;
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
  const [role, setRole] = useState<'delegate' | 'IP'>(delegate.allocation?.committee ? 'delegate' : 'IP');
  const [committee, setCommittee] = useState(delegate.allocation?.committee || '');
  const [country, setCountry] = useState(delegate.allocation?.country || '');
  const [ipSubrole, setIpSubrole] = useState<'reporter' | 'photojournalist' | 'editor'>('reporter');
  const [isEditing, setIsEditing] = useState(false);
  const [confirmType, setConfirmType] = useState<'allocate' | 'edit' | 'delete' | null>(null);

  const availableCountries: Country[] = committee ? getAvailableCountries(committee) : [];

  const handleAllocate = () => {
    if (role === 'delegate' && committee && country) {
      onAllocate({
        user_id: delegate.id,
        role: 'delegate',
        committee_id: committee,
        country_id: country,
        ip_subrole: null,
      });
    } else if (role === 'IP') {
      onAllocate({
        user_id: delegate.id,
        role: 'IP',
        committee_id: null,
        country_id: null,
        ip_subrole: ipSubrole,
      });
    }
  };

  const handleEdit = () => {
    if (role === 'delegate' && committee && country) {
      onEditAllocation({
        user_id: delegate.id,
        role: 'delegate',
        committee_id: committee,
        country_id: country,
        ip_subrole: null,
      });
    } else if (role === 'IP') {
      onEditAllocation({
        user_id: delegate.id,
        role: 'IP',
        committee_id: null,
        country_id: null,
        ip_subrole: ipSubrole,
      });
    }
    setIsEditing(false);
  };

  return (
        <>
          <div className="flex flex-col gap-4 w-full pb-5">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${role === 'delegate' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setRole('delegate')}
              >
                Delegate
              </button>
              <button
                className={`px-4 py-2 rounded ${role === 'IP' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
                  className="w-full"
                />
                <Dropdown
                  options={availableCountries.length > 0
                    ? availableCountries.map(c => ({ id: c.id, name: c.name }))
                    : [{ id: '', name: 'All countries allocated' }]
                  }
                  value={country}
                  onChange={setCountry}
                  placeholder="Select Country"
                  disabled={!committee || availableCountries.length === 0}
                  className="w-full"
                />
              </>
            ) : (
              <Dropdown
                options={[
                  { id: 'reporter', name: 'Reporter' },
                  { id: 'photojournalist', name: 'Photojournalist' },
                  { id: 'editor', name: 'Editor' },
                ]}
                value={ipSubrole}
                onChange={(value) => setIpSubrole(value as any)}
                placeholder="Select IP Role"
                className="w-full"
              />
            )}
          </div>

         <button
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-900 disabled:bg-gray-400"
              onClick={() => setConfirmType(isAllocated ? 'edit' : 'allocate')}
              disabled={role === 'delegate' ? (!committee || !country) : false}
            >
              {isAllocated ? 'Update Allocation' : 'Allocate'}
            </button>
         {isAllocated && (
            <button
              className="ml-7 px-9 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setConfirmType('delete')}
            >
              Delete
            </button>
          )}

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
          onConfirm={() => {
            if (confirmType === 'allocate') handleAllocate();
            else if (confirmType === 'edit') handleEdit();
            else if (confirmType === 'delete') onDeleteAllocation();
          }}
        />
        </>
      )}
   


export default AllocationForm;
