import React, { useState, useEffect } from 'react';
import { LeftPanelProps } from './types';
import { Snippet } from '../../types';
import { groupSnippetsByCategory, getAllCategories } from './utils';
import {
  LeftPanelHeader,
  SearchInput,
  CategoryList,
  CreateCategoryForm,
  ContextMenu
} from './components';

const LeftPanel: React.FC<LeftPanelProps> = ({
  searchQuery,
  setSearchQuery,
  onAddSnippet,
  snippets,
  onMoveSnippet,
  onEditSnippet,
  onDeleteSnippet,
  onDeleteCategory,
  onRenameSnippet,
  onRenameCategory,
  onCreateCategory,
  selectedSnippet,
  setSelectedSnippet
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Backend': true,
    'Frontend': true,
    'Database': true,
    'Algorithms': true
  });
  const [showNewCategory, setShowNewCategory] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: 'snippet' | 'category' | null;
    item: Snippet | string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    type: null,
    item: null
  });

  // Группируем сниппеты по категориям с учетом поискового запроса
  const groupedSnippets = groupSnippetsByCategory(snippets, searchQuery);

  // Добавляем пустые категории только если нет поискового запроса
  if (!searchQuery || !searchQuery.trim()) {
    const allCategories = getAllCategories(snippets);
    allCategories.forEach(category => {
      if (!groupedSnippets[category]) {
        groupedSnippets[category] = [];
      }
    });
  }

  const toggleCategory = (category: string): void => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'snippet' | 'category', item: Snippet | string): void => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type: type,
      item: item
    });
  };

  const handleContextMenuAction = (action: string): void => {
    if (contextMenu.type === 'snippet' && contextMenu.item && typeof contextMenu.item === 'object') {
      if (action === 'delete') {
        onDeleteSnippet((contextMenu.item as Snippet).id);
      }
    } else if (contextMenu.type === 'category' && typeof contextMenu.item === 'string') {
      if (action === 'delete') {
        onDeleteCategory(contextMenu.item);
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, type: null, item: null });
  };

  const handleCreateCategory = (categoryName: string): void => {
    // Добавляем новую категорию в состояние
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: true
    }));
    // Вызываем функцию создания категории из родительского компонента
    onCreateCategory(categoryName);
    setShowNewCategory(false);
  };

  // Автоматически добавляем новые категории в expandedCategories
  useEffect(() => {
    const currentCategories = Object.keys(groupedSnippets);
    const newCategories = currentCategories.filter(cat => !(cat in expandedCategories));
    
    if (newCategories.length > 0) {
      setExpandedCategories(prev => {
        const updated = { ...prev };
        newCategories.forEach(cat => {
          updated[cat] = true; // Новые категории открыты по умолчанию
        });
        return updated;
      });
    }
  }, [groupedSnippets, expandedCategories]);

  return (
    <div className="bg-bg-panel border-r border-gray-700 flex flex-col h-full">
      <LeftPanelHeader
        onAddSnippet={onAddSnippet}
        onCreateCategory={() => setShowNewCategory(true)}
      />

      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsCount={Object.values(groupedSnippets).flat().length}
      />

      <CategoryList
        groupedSnippets={groupedSnippets}
        expandedCategories={expandedCategories}
        onToggleCategory={toggleCategory}
        onRenameCategory={onRenameCategory}
        onDeleteCategory={onDeleteCategory}
        onSnippetSelect={setSelectedSnippet}
        onSnippetEdit={onEditSnippet}
        onSnippetDelete={onDeleteSnippet}
        onSnippetRename={onRenameSnippet}
        onSnippetMove={onMoveSnippet}
        onSnippetContextMenu={(e, snippet) => handleContextMenu(e, 'snippet', snippet)}
        onCategoryContextMenu={(e, category) => handleContextMenu(e, 'category', category)}
        selectedSnippet={selectedSnippet}
      />

      <CreateCategoryForm
        isVisible={showNewCategory}
        onClose={() => setShowNewCategory(false)}
        onCreate={handleCreateCategory}
      />

      <ContextMenu
        isVisible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        type={contextMenu.type}
        onAction={handleContextMenuAction}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0, type: null, item: null })}
      />
    </div>
  );
};

export default LeftPanel;