import React from 'react';
import { Snippet } from '../../../types';

interface SnippetDisplayProps {
  snippet: Snippet;
  isSelected: boolean;
  onSelect: (snippet: Snippet) => void;
  onContextMenu: (e: React.MouseEvent, snippet: Snippet) => void;
}

const SnippetDisplay: React.FC<SnippetDisplayProps> = ({
  snippet,
  isSelected,
  onSelect,
  onContextMenu
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => {
        const dragData = {
          snippetId: snippet.id,
          sourceCategory: snippet.category
        };
        e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onSelect(snippet)}
      onContextMenu={(e) => onContextMenu(e, snippet)}
      className={`flex items-center px-6 py-1 hover:bg-selection cursor-pointer text-sm ${
        isSelected
          ? 'bg-accent/20 text-accent'
          : 'text-text-primary'
      }`}
    >
      <span className="text-text-secondary mr-2">📄</span>
      <span className="truncate">{snippet.title}</span>
    </div>
  );
};

export default SnippetDisplay;
