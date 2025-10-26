import React from 'react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  resultsCount
}) => {
  return (
    <div className="p-3 border-b border-gray-700">
      <input
        type="text"
        placeholder="🔍 Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 bg-selection border border-gray-600 rounded text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none text-sm"
      />
      {searchQuery && searchQuery.trim() && (
        <div className="mt-2 text-xs text-text-secondary">
          {resultsCount !== undefined ? (
            <>Found {resultsCount} snippet{resultsCount !== 1 ? 's' : ''}</>
          ) : (
            'Searching...'
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
