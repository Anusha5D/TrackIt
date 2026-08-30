import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { STATUS_OPTIONS } from '../utils/constants';
import { useDebounce } from '../hooks/useDebounce';

const FilterBar = ({ filters, setFilters }) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ status: '', search: '' });
  };

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <select
        value={filters.status}
        onChange={handleStatusChange}
        className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
        >
          <X size={16} />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterBar;