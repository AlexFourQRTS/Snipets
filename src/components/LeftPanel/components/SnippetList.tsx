import React from 'react';
import { Snippet } from '../../../types';
import SnippetItem from './SnippetItem';

interface SnippetListProps {
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  onSnippetSelect: (snippet: Snippet) => void;
  onSnippetEdit: (snippet: Snippet) => void;
  onSnippetDelete: (snippetId: number) => void;
  onSnippetRename: (snippetId: number, newTitle: string) => void;
  onSnippetContextMenu: (e: React.MouseEvent, snippet: Snippet) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  selectedSnippet,
  onSnippetSelect,
  onSnippetEdit,
  onSnippetDelete,
  onSnippetRename,
  onSnippetContextMenu
}) => {
  if (snippets.length === 0) {
    return (
      <div className="px-6 py-3 text-center text-text-secondary text-sm">
        <span className="text-xs opacity-60">empty</span>
      </div>
    );
  }

  return (
    <>
      {snippets.map((snippet) => (
        <SnippetItem
          key={snippet.id}
          snippet={snippet}
          isSelected={selectedSnippet?.id === snippet.id}
          onSelect={onSnippetSelect}
          onEdit={onSnippetEdit}
          onDelete={onSnippetDelete}
          onRename={onSnippetRename}
          onContextMenu={onSnippetContextMenu}
        />
      ))}
    </>
  );
};

export default SnippetList;
