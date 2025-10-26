import React from 'react';

interface LeftPanelHeaderProps {
  onAddSnippet: () => void;
  onCreateCategory: () => void;
}

const LeftPanelHeader: React.FC<LeftPanelHeaderProps> = ({
  onAddSnippet,
  onCreateCategory
}) => {
  return (
    <div className="p-3 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">SNIPPETS</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={onCreateCategory}
            className="text-text-secondary hover:text-text-primary text-lg"
            title="Create New Category"
          >
            📁
          </button>
          <button 
            onClick={onAddSnippet}
            className="text-text-secondary hover:text-text-primary text-lg"
            title="Add New Snippet"
          >
            ➕
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanelHeader;
