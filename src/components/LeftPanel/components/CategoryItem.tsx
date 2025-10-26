import React, { useState } from 'react';
import { Snippet } from '../../../types';
import CategoryHeader from './CategoryHeader';
import SnippetList from './SnippetList';

interface CategoryItemProps {
  category: string;
  snippets: Snippet[];
  isExpanded: boolean;
  onToggle: (category: string) => void;
  onRename: (oldCategory: string, newCategory: string) => void;
  onDelete: (categoryName: string) => void;
  onSnippetSelect: (snippet: Snippet) => void;
  onSnippetEdit: (snippet: Snippet) => void;
  onSnippetDelete: (snippetId: number) => void;
  onSnippetRename: (snippetId: number, newTitle: string) => void;
  onSnippetMove: (snippetId: number, fromCategory: string, toCategory: string) => void;
  onSnippetContextMenu: (e: React.MouseEvent, snippet: Snippet) => void;
  onCategoryContextMenu: (e: React.MouseEvent, category: string) => void;
  selectedSnippet: Snippet | null;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  snippets,
  isExpanded,
  onToggle,
  onRename,
  onDelete,
  onSnippetSelect,
  onSnippetEdit,
  onSnippetDelete,
  onSnippetRename,
  onSnippetMove,
  onSnippetContextMenu,
  onCategoryContextMenu,
  selectedSnippet
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleStartRename = (): void => {
    setIsRenaming(true);
  };

  const handleRenameChange = (value: string): void => {
    setHasChanges(value.trim() !== category);
  };

  const handleSaveRename = (): void => {
    if (hasChanges) {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input && input.value.trim()) {
        onRename(category, input.value.trim());
      }
      setIsRenaming(false);
      setHasChanges(false);
    }
  };

  const handleCancelRename = (): void => {
    setIsRenaming(false);
    setHasChanges(false);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.sourceCategory !== category) {
        onSnippetMove(data.snippetId, data.sourceCategory, category);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div className="border-b border-gray-700">
      <CategoryHeader
        category={category}
        snippetCount={snippets.length}
        isExpanded={isExpanded}
        isRenaming={isRenaming}
        hasChanges={hasChanges}
        onToggle={() => onToggle(category)}
        onStartRename={handleStartRename}
        onSaveRename={handleSaveRename}
        onCancelRename={handleCancelRename}
        onChange={handleRenameChange}
        onContextMenu={(e) => onCategoryContextMenu(e, category)}
      />

      {isExpanded && (
        <div 
          className="bg-bg-main"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <SnippetList
            snippets={snippets}
            selectedSnippet={selectedSnippet}
            onSnippetSelect={onSnippetSelect}
            onSnippetEdit={onSnippetEdit}
            onSnippetDelete={onSnippetDelete}
            onSnippetRename={onSnippetRename}
            onSnippetContextMenu={onSnippetContextMenu}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryItem;