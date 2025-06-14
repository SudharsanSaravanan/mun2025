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
}

const DelegateCard: React.FC<DelegateCardProps> = ({
  delegate,
  committees,
  getAvailableCountries,
  onAllocate,
  onEditAllocation,
  onDeleteAllocation,
  isAllocated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-blue-200 rounded-lg shadow-md p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-blue-900">{delegate.name}</h3>
        <span className="text-blue-600">{isExpanded ? 'Close' : 'View'}</span>
      </div>
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-semibold text-blue-800">Registration Details</h4>
            <p><strong>Name:</strong> {delegate.name}</p>
            <p><strong>Email:</strong> {delegate.email}</p>
            <p><strong>Phone:</strong> {delegate.phone}</p>
            <p><strong>Institution:</strong> {delegate.institution}</p>
            <p><strong>Type:</strong> {delegate.internal ? 'Internal' : 'External'}</p>
            <FileDownloadButtons uploads={delegate.uploads} />
          </div>
          <div>
            <h4 className="text-md font-semibold text-blue-800">Allocation</h4>
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