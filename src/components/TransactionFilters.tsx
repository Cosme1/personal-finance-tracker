interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
}

export const TransactionFilters = ({
  searchQuery,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: TransactionFiltersProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4 mb-6">
      <h3 className="text-xl font-semibold">Filter Transactions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          Search
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by category or account..."
            className="p-2 bg-gray-900 border border-gray-700 rounded-md mt-1"
          />
        </label>

        <label className="flex flex-col">
          Category
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="p-2 bg-gray-900 border border-gray-700 rounded-md mt-1"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="p-2 bg-gray-900 border border-gray-700 rounded-md mt-1"
          />
        </label>

        <label className="flex flex-col">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="p-2 bg-gray-900 border border-gray-700 rounded-md mt-1"
          />
        </label>
      </div>

      <button
        onClick={() => {
          onSearchChange('');
          onStartDateChange('');
          onEndDateChange('');
          onCategoryFilterChange('');
        }}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
};
