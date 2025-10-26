import React from 'react';
import { Snippet } from '../../../types';
import LeftPanel from '../../LeftPanel';
import RightPanel from '../../RightPanel';
import SnippetModal from '../../SnippetModal';

interface AppLayoutProps {
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
  onUpdateSnippet: (snippetId: number, field: keyof Snippet, value: any) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  editingSnippet: Snippet | null;
  onSaveSnippet: (snippet: Snippet) => void;
  modalMode: 'add' | 'edit';
}

const AppLayout: React.FC<AppLayoutProps> = ({
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
  setSelectedSnippet,
  onUpdateSnippet,
  isModalOpen,
  onCloseModal,
  editingSnippet,
  onSaveSnippet,
  modalMode
}) => {
  return (
    <>
      <div className="h-full grid grid-cols-[280px_1fr]" style={{ height: 'calc(100vh - 60px)' }}>
        <LeftPanel 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddSnippet={onAddSnippet}
          snippets={snippets}
          onMoveSnippet={onMoveSnippet}
          onEditSnippet={onEditSnippet}
          onDeleteSnippet={onDeleteSnippet}
          onDeleteCategory={onDeleteCategory}
          onRenameSnippet={onRenameSnippet}
          onRenameCategory={onRenameCategory}
          onCreateCategory={onCreateCategory}
          selectedSnippet={selectedSnippet}
          setSelectedSnippet={setSelectedSnippet}
        />
        <RightPanel 
          selectedSnippet={selectedSnippet} 
          onUpdateSnippet={onUpdateSnippet}
          onDeleteSnippet={onDeleteSnippet}
          snippets={snippets}
        />
      </div>

      {/* Modal для редактирования сниппетов */}
      <SnippetModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        snippet={editingSnippet}
        onSave={onSaveSnippet}
        mode={modalMode}
      />
    </>
  );
};

export default AppLayout;
