import { Snippet } from '../../types';

export interface AppState {
  selectedSnippet: Snippet | null;
  searchQuery: string;
  jsonPath: string;
  snippets: Snippet[];
  isModalOpen: boolean;
  editingSnippet: Snippet | null;
  modalMode: 'add' | 'edit';
  currentFilePath: string;
}

export interface AppActions {
  setSelectedSnippet: (snippet: Snippet | null) => void;
  setSearchQuery: (query: string) => void;
  setJsonPath: (path: string) => void;
  setSnippets: (snippets: Snippet[]) => void;
  setIsModalOpen: (open: boolean) => void;
  setEditingSnippet: (snippet: Snippet | null) => void;
  setModalMode: (mode: 'add' | 'edit') => void;
  setCurrentFilePath: (path: string) => void;
}
