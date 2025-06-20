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
            ? 'bg-blue-900 text-white'
            : 'bg-gray-200 text-blue-900'
        }`}
        onClick={() => setActiveTab('Unallocated')}
      >
        Unallocated 
        {unallocatedCount > 0 && (
          <span className={`ml-2 rounded-full px-2 py-1 text-xs font-extrabold ${
            activeTab === 'Unallocated'
              ? 'bg-white text-blue-600'  // Active state: white bg, blue text
              : 'bg-blue-900 text-white'   // Inactive state: blue bg, white text
          }`}>
            {unallocatedCount}
          </span>
        )}
      </button>
      <button
        className={`px-4 py-2 font-semibold rounded-t-lg ${
          activeTab === 'Allocated'
            ? 'bg-blue-900 text-white'
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