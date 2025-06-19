import React, { useState } from 'react';
import AllocationForm from './AllocationForm';
import FileDownloadButtons from './FileDownloadButtons';
import { Delegate, Allocation } from '.././types';

interface DelegateCardProps {
  delegate: Delegate;
  committees: string[];
  getAvailableCountries: (committee: string) => string[];
  onAllocate: (delegateId: number, allocation: Allocation) => void;
  onEditAllocation: (delegateId: number, allocation: Allocation) => void;
  onDeleteAllocation: (delegateId: number) => void;
  isAllocated: boolean;
  filter: 'All' | 'Internal' | 'External';
}

const DelegateCard: React.FC<DelegateCardProps> = ({
  delegate,
  committees,
  getAvailableCountries,
  onAllocate,
  onEditAllocation,
  onDeleteAllocation,
  isAllocated,
  filter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderPreference = (pref: any, index: number) => {
    return (
      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-black">
        <p className="font-bold text-blue-800 mb-2">Preference {index + 1}: {pref.type}</p>
        
        {pref.type === 'IP' ? (
          <div className="ml-4 space-y-1">
            <p> <span className="font-semibold">Prefered Role: </span> {pref.role}</p>
            {pref.role === 'Reporter' && pref.committee && (
              <p> <span className="font-semibold"> Committee Preference:</span> {pref.committee}</p>
            )}
          </div>
        ) : (
          <div className="ml-4 space-y-1">
            {pref.committee && <p> <span className='font-semibold'>Committee Preference:</span> {pref.committee}</p>}
            {pref.countries && pref.countries.length > 0 && (
              <div>
                <p className="font-semibold mb-1">Country Preferences:</p>
                <div className="ml-4 space-y-1">
                  {pref.countries.map((country: string, countryIndex: number) => (
                    <p key={countryIndex}>
                      Country Preference {countryIndex + 1}: {country}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              delegate.internal 
                ? 'bg-green-100 text-green-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {delegate.internal ? 'Internal' : 'External'}
            </span>
          )}
         {!delegate.internal && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {delegate.institution}
          </span>
        )}
          {delegate.isHeadDelegation && !delegate.internal && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Head of Delegation
            </span>
          )}
        </div>
        <span className="text-blue-600 text-sm font-medium">{isExpanded ? 'Close' : 'View'}</span>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-bold text-blue-800 mb-2">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Full Name:</span> {delegate.name}</p>
              <p><span className="font-semibold">Phone Number:</span> {delegate.phone}</p>
              <p><span className="font-semibold">Email ID:</span> {delegate.email}</p>
              
              {delegate.internal ? (
                <p><span className="font-semibold">Roll Number:</span> {delegate.rollNumber}</p>
              ) : (
                <>
                  <p><span className="font-semibold">Residential Address:</span> {delegate.address}</p>
                  <p><span className="font-semibold">Residential Pin Code:</span> {delegate.pinCode}</p>
                  <p><span className="font-semibold">University/Institution Name:</span> {delegate.institution}</p>
                  <p><span className="font-semibold">University Address:</span> {delegate.address}</p>
                  <p><span className="font-semibold">University Pin Code:</span> {delegate.pinCode}</p>
                  <p><span className="font-semibold">Accommodation Needed:</span> {delegate.accommodationNeeded ? 'Yes' : 'No'}</p>
                  
                  <h4 className="text-md font-bold text-blue-800 mt-4 mb-2">Delegation Details</h4>
                  {delegate.delegationName ? (
                    <>
                      <p><span className="font-semibold">Type:</span> Group Delegation</p>
                      <p><span className="font-semibold">Delegation Name:</span> {delegate.delegationName}</p>
                      <p><span className="font-semibold">Head of Delegation:</span> {delegate.isHeadDelegation ? 'Yes' : 'No'}</p>
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
            <FileDownloadButtons uploads={delegate.uploads} />
          </div>

          <div>
            <h4 className="text-md font-bold text-blue-800 mb-2">Allocation</h4>
            <AllocationForm
              delegate={delegate}
              committees={committees}
              getAvailableCountries={getAvailableCountries}
              onAllocate={onAllocate}
              onEditAllocation={onEditAllocation}
              onDeleteAllocation={onDeleteAllocation}
              isAllocated={isAllocated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DelegateCard;