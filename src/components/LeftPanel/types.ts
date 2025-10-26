import { Snippet } from '../../types';

export interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddSnippet: () => void;
  snippets: Snippet[];
  onMoveSnippet: (snippetId: number, fromCategory: string, toCategory: string) => void;
  onEditSnippet: (snippet: Snippet) => void;
  onDeleteSnippet: (snippetId: number) => void;
  onDeleteCategory: (categoryName: string) => void;
  onRenameSnippet: (snippetId: number, newTitle: string) => void;
  onRenameCategory: (oldCategory: string, newCategory: string) => void;
  onCreateCategory: (categoryName: string) => void;
  selectedSnippet: Snippet | null;
  setSelectedSnippet: (snippet: Snippet | null) => void;
}

// Упрощенные типы для рефакторированного LeftPanel
export interface LeftPanelState {
  expandedCategories: Record<string, boolean>;
  showNewCategory: boolean;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    type: 'snippet' | 'category' | null;
    item: Snippet | string | null;
  };
}

export interface DragData {
  snippetId: number;
  sourceCategory: string;
}
