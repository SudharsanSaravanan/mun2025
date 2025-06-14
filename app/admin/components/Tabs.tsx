import React from 'react';

interface TabsProps {
  activeTab: 'Unallocated' | 'Allocated';
  setActiveTab: (tab: 'Unallocated' | 'Allocated') => void;
  unallocatedCount: number;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, unallocatedCount }) => {
  return (
    <div className="flex space-x-4">
      <button
        className={`px-4 py-2 font-semibold rounded-t-lg ${
          activeTab === 'Unallocated'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-blue-900'
        }`}
        onClick={() => setActiveTab('Unallocated')}
      >
        Unallocated <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">{unallocatedCount}</span>
      </button>
      <button
        className={`px-4 py-2 font-semibold rounded-t-lg ${
          activeTab === 'Allocated'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-blue-900'
        }`}
        onClick={() => setActiveTab('Allocated')}
      >
        Allocated
      </button>
    </div>
  );
};

export default Tabs;