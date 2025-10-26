import React from 'react';
import { Snippet } from '../../../types';

interface SnippetHeaderProps {
  snippet: Snippet;
  onCopy: () => void;
  onDelete: () => void;
}

const SnippetHeader: React.FC<SnippetHeaderProps> = ({
  snippet,
  onCopy,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-text-primary truncate">
          {snippet.title}
        </h2>
        <span className="text-xs text-text-secondary bg-selection px-2 py-1 rounded">
          {snippet.language}
        </span>
        <span className="text-xs text-text-secondary bg-selection px-2 py-1 rounded">
          {snippet.category}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCopy}
          className="text-text-secondary hover:text-text-primary p-2 rounded hover:bg-selection transition-colors"
          title="Copy to clipboard"
        >
          📋
        </button>
        <button
          onClick={onDelete}
          className="text-text-secondary hover:text-red-400 p-2 rounded hover:bg-selection transition-colors"
          title="Delete snippet"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default SnippetHeader;
