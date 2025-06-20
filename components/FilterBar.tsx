import React from 'react';
import Dropdown from './Dropdown';

interface FilterBarProps {
  filter: 'All' | 'Internal' | 'External';
  setFilter: (filter: 'All' | 'Internal' | 'External') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter }) => {
  const options = ['All', 'Internal', 'External'];

  return (
    <div className="flex items-center">
      <label className="mr-2 text-blue-900 font-semibold">Filter:</label>
      <Dropdown
        options={options}
        value={filter}
        onChange={(value) => setFilter(value as 'All' | 'Internal' | 'External')}
        placeholder="Select a filter"
      />
    </div>
  );
};

export default FilterBar;