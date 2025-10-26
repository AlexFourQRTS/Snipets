import React, { useState } from 'react';
import { Snippet } from '../../../types';
import SnippetDisplay from './SnippetDisplay';
import SnippetEditor from './SnippetEditor';

interface SnippetItemProps {
  snippet: Snippet;
  isSelected: boolean;
  onSelect: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippetId: number) => void;
  onRename: (snippetId: number, newTitle: string) => void;
  onContextMenu: (e: React.MouseEvent, snippet: Snippet) => void;
}

const SnippetItem: React.FC<SnippetItemProps> = ({
  snippet,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onRename,
  onContextMenu
}) => {
  const [isRenaming, setIsRenaming] = useState(false);

  const handleDoubleClick = (): void => {
    setIsRenaming(true);
  };

  const handleSaveRename = (snippetId: number, newTitle: string): void => {
    onRename(snippetId, newTitle);
    setIsRenaming(false);
  };

  const handleCancelRename = (): void => {
    setIsRenaming(false);
  };

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
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => onContextMenu(e, snippet)}
      className={`flex items-center px-6 py-1 hover:bg-selection cursor-pointer text-sm ${
        isSelected
          ? 'bg-accent/20 text-accent'
          : 'text-text-primary'
      }`}
    >
      <span className="text-text-secondary mr-2">📄</span>
      {isRenaming ? (
        <SnippetEditor
          snippet={snippet}
          onSave={handleSaveRename}
          onCancel={handleCancelRename}
        />
      ) : (
        <span className="truncate">{snippet.title}</span>
      )}
    </div>
  );
};

export default SnippetItem;