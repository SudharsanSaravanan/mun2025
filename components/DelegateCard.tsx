
'use client';

import React, { useState } from 'react';
import AllocationForm from './AllocationForm';
import FileDownloadButtons from './FileDownloadButtons';
import { UserWithData, Allocation } from '../types/types';
import { Committee, Country } from '../types/types';
import ConfirmationModal from './ConfirmationBox';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface DelegateCardProps {
  delegate: UserWithData;
  committees: Committee[];
  committeeMap: Record<string, Committee>;
  countryMap: Record<string, Country>;
  getAvailableCountries: (committeeId: string) => Country[];
  onAllocate: (allocation: Omit<Allocation, 'allocated_at'>) => Promise<void>;
  onEditAllocation: (allocation: Omit<Allocation, 'allocated_at'>) => Promise<void>;
  onDeleteAllocation: (userId: string) => Promise<void>;
  isAllocated: boolean;
  filter: 'All' | 'Internal' | 'External';
}

const DelegateCard: React.FC<DelegateCardProps> = ({
  delegate,
  committees,
  committeeMap,
  countryMap,
  getAvailableCountries,
  onAllocate,
  onEditAllocation,
  onDeleteAllocation,
  isAllocated,
  filter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getCommitteeName = (committeeId: string) => {
    return committeeMap[committeeId]?.name || committeeId;
  };

  const getCountryName = (countryId: string) => {
    return countryMap[countryId]?.name || countryId;
  };

  const renderPreference = (pref: any, index: number) => {
    return (
      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-black">
        <p className="font-bold text-blue-800 mb-2">Preference {index + 1}: {pref.role === 'IP' ? 'IP' : 'Delegate'}</p>
        {pref.role === 'IP' ? (
          <div className="ml-4 space-y-1">
            <p><span className="font-semibold">Role:</span> {pref.ip_subrole || 'IP Member'}</p>
            {pref.ip_committee_preferences?.length > 0 && (
              <div>
                <p className="font-semibold mb-1">Committee Preferences:</p>
                <div className="ml-4 space-y-1">
                  {pref.ip_committee_preferences.map((committeePref: any, committeeIndex: number) => (
                    <p key={committeeIndex}>
                      {committeePref.committee_order}. {getCommitteeName(committeePref.committee_id)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="ml-4 space-y-1">
            {pref.committee_id && (
              <p><span className="font-semibold">Committee Preference:</span> {getCommitteeName(pref.committee_id)}</p>
            )}
            {pref.delegate_country_preferences?.length > 0 && (
              <div>
                <p className="font-semibold mb-1">Country Preferences:</p>
                <div className="ml-4 space-y-1">
                  {pref.delegate_country_preferences.map((countryPref: any, countryIndex: number) => (
                    <p key={countryIndex}>
                      {countryPref.country_order}. {getCountryName(countryPref.country_id)}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {pref.co_delegate_name && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="font-semibold">Co-Delegate Details:</p>
                <p><span className="font-semibold">Name:</span> {pref.co_delegate_name}</p>
                <p><span className="font-semibold">Email:</span> {pref.co_delegate_email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleAllocate = async (allocation: Omit<Allocation, 'allocated_at'>) => {
    await onAllocate(allocation);
  };

  const handleEditAllocation = async (allocation: Omit<Allocation, 'allocated_at'>) => {
    await onEditAllocation(allocation);
  };

  const handleDeleteAllocation = async () => {
    await onDeleteAllocation(delegate.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 font-[Roboto] text-black">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold">{delegate.name}</h3>
          {filter === 'All' && (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              delegate.is_internal
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {delegate.is_internal ? 'Internal' : 'External'}
            </span>
          )}
          {!delegate.is_internal && delegate.external_registrations?.university_name && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {delegate.external_registrations.university_name}
            </span>
          )}
          {delegate.external_registrations?.is_head_of_delegation && !delegate.is_internal && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Head of Delegation
            </span>
          )}
        </div>
        <span className="text-blue-600 text-sm font-medium">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-bold text-blue-800 mb-2">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Full Name:</span> {delegate.name}</p>
              <p><span className="font-semibold">Phone Number:</span> {delegate.phone_number}</p>
              <p><span className="font-semibold">Email ID:</span> {delegate.email}</p>
              {delegate.is_internal ? (
                <>
                  <p><span className="font-semibold">Roll Number:</span> {delegate.internal_registrations?.roll_number}</p>
                </>
              ) : (
                <>
                  <p><span className="font-semibold">Residential Address:</span> {delegate.external_registrations?.residential_address}</p>
                  <p><span className="font-semibold">Residential Pin Code:</span> {delegate.external_registrations?.residential_pincode}</p>
                  <p><span className="font-semibold">University/Institution Name:</span> {delegate.external_registrations?.university_name}</p>
                  <p><span className="font-semibold">University Address:</span> {delegate.external_registrations?.university_address}</p>
                  <p><span className="font-semibold">University Pin Code:</span> {delegate.external_registrations?.university_pincode}</p>
                  <p><span className="font-semibold">Accommodation Needed:</span> {delegate.external_registrations?.accomodation_required ? 'Yes' : 'No'}</p>
                </>
              )}
              
              <br />
              <p><span className="font-semibold">Payment ID:</span> {delegate.internal_registrations?.payment_id || delegate.external_registrations?.payment_id}</p>
              <p><span className="font-semibold">Payment Date:</span> {delegate.internal_registrations?.payment_date || delegate.external_registrations?.payment_date}</p>
              <p><span className="font-semibold">Bank Name:</span> {delegate.internal_registrations?.bank_name || delegate.external_registrations?.bank_name}</p>
              <p><span className="font-semibold">Bank Branch:</span> {delegate.internal_registrations?.bank_branch || delegate.external_registrations?.bank_branch}</p>
              
              {!delegate.is_internal && (
                <>
                  <h4 className="text-md font-bold text-blue-800 mt-4 mb-2">Delegation Details</h4>
                  {delegate.external_registrations?.delegation_name ? (
                    <>
                      <p><span className="font-semibold">Type:</span> {delegate.external_registrations.delegation_type}</p>
                      <p><span className="font-semibold">Delegation Name:</span> {delegate.external_registrations.delegation_name}</p>
                      <p><span className="font-semibold">Head of Delegation:</span> {delegate.external_registrations.is_head_of_delegation ? 'Yes' : 'No'}</p>
                    </>
                  ) : (
                    <p><span className="font-semibold">Type:</span> Individual Delegate</p>
                  )}
                </>
              )}
            </div>

            <h4 className="text-md font-bold text-blue-800 mt-6 mb-2">Preferences</h4>
            <div className="space-y-4">
              {delegate.preferences.map((pref, index) => renderPreference(pref, index))}
            </div>

            <h4 className="text-md font-bold text-blue-800 mt-6 mb-2">Documents</h4>
            <FileDownloadButtons
              uploads={{
                paymentProof: delegate.internal_registrations?.payment_proof_url || delegate.external_registrations?.payment_proof_url || '',
                collegeId: delegate.internal_registrations?.college_id_photo_url,
                aadharId: delegate.external_registrations?.id_proof_url,
                delegateExperience: delegate.internal_registrations?.delegate_experience_doc_url || delegate.external_registrations?.delegate_experience_doc_url,
                delegationSheet: delegate.external_registrations?.delegation_sheet_url || undefined
              }}
            />
          </div>

          <div>
            <h4 className="text-md font-bold text-blue-800 mb-2">Allocation</h4>
            {!delegate.allocation || isEditing ? (
              <AllocationForm
                delegate={{
                  id: delegate.id,
                  name: delegate.name,
                  allocation: delegate.allocation ? {
                    role: delegate.allocation.role,
                    ip_subrole: delegate.allocation.ip_subrole || undefined,
                    committee: delegate.allocation.committee_id || '',
                    country: delegate.allocation.country_id || '',
                    is_double_delegation: delegate.allocation.is_double_delegation || false
                  } : null,
                  is_internal: delegate.is_internal,
                  preferences: delegate.preferences
                }}
                committees={committees.map(c => ({ 
                  id: c.id, 
                  name: c.name,
                  is_double_delegation: c.is_double_delegation 
                }))}
                getAvailableCountries={getAvailableCountries}
                onAllocate={async (allocation) => {
                  await handleAllocate(allocation);
                  setIsEditing(false);
                }}
                onEditAllocation={async (allocation) => {
                  await handleEditAllocation(allocation);
                  setIsEditing(false);
                }}
                onDeleteAllocation={handleDeleteAllocation}
                isAllocated={isAllocated}
                setIsEditing={setIsEditing}
              />
            ) : (
            <div className="space-y-2 text-sm mb-4">
              <p>
                <span className="font-semibold">Role:</span> {delegate.allocation.role === 'IP' ? 'IP' : 'Delegate'}
              </p>

              {delegate.allocation.role === 'delegate' && (
                <>
                  <p><span className="font-semibold">Committee:</span> {delegate.allocation.committee_id ? getCommitteeName(delegate.allocation.committee_id) : 'N/A'}</p>
                  <p><span className="font-semibold">Country:</span> {delegate.allocation.country_id ? getCountryName(delegate.allocation.country_id) : 'N/A'}</p>
                  {delegate.allocation.is_double_delegation && (
                    <p><span className="font-semibold">Double Delegation:</span> Yes</p>
                  )}
                </>
              )}

              {delegate.allocation.role === 'IP' && (
                <p><span className="font-semibold">IP Role:</span> {delegate.allocation.ip_subrole || 'N/A'}</p>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-[#1c398e] text-white px-4 py-2 rounded hover:cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:cursor-pointer"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
              </div>
            </div>
            )}

            <ConfirmationModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={async () => {
                await handleDeleteAllocation();
                setShowDeleteConfirm(false);
              }}
              message="Are you sure you want to delete this user's allocation?"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DelegateCard;