import React from 'react';
import { Snippet } from '../../../types';
import CategoryItem from './CategoryItem';

interface CategoryListProps {
  groupedSnippets: Record<string, Snippet[]>;
  expandedCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onRenameCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onSnippetSelect: (snippet: Snippet) => void;
  onSnippetEdit: (snippet: Snippet) => void;
  onSnippetDelete: (snippetId: number) => void;
  onSnippetRename: (snippetId: number, newTitle: string) => void;
  onSnippetMove: (snippetId: number, fromCategory: string, toCategory: string) => void;
  onSnippetContextMenu: (e: React.MouseEvent, snippet: Snippet) => void;
  onCategoryContextMenu: (e: React.MouseEvent, category: string) => void;
  selectedSnippet: Snippet | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  groupedSnippets,
  expandedCategories,
  onToggleCategory,
  onRenameCategory,
  onDeleteCategory,
  onSnippetSelect,
  onSnippetEdit,
  onSnippetDelete,
  onSnippetRename,
  onSnippetMove,
  onSnippetContextMenu,
  onCategoryContextMenu,
  selectedSnippet
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {Object.entries(groupedSnippets).map(([category, categorySnippets]) => (
        <CategoryItem
          key={category}
          category={category}
          snippets={categorySnippets}
          isExpanded={expandedCategories[category]}
          onToggle={onToggleCategory}
          onRename={onRenameCategory}
          onDelete={onDeleteCategory}
          onSnippetSelect={onSnippetSelect}
          onSnippetEdit={onSnippetEdit}
          onSnippetDelete={onSnippetDelete}
          onSnippetRename={onSnippetRename}
          onSnippetMove={onSnippetMove}
          onSnippetContextMenu={onSnippetContextMenu}
          onCategoryContextMenu={onCategoryContextMenu}
          selectedSnippet={selectedSnippet}
        />
      ))}
    </div>
  );
};

export default CategoryList;
