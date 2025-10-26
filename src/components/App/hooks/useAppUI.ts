import { useState, useEffect } from 'react';
import { Snippet } from '../../../types';

export const useAppUI = (snippets: Snippet[]) => {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jsonPath, setJsonPath] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Проверяем, что selectedSnippet существует в текущем массиве snippets
  useEffect(() => {
    if (selectedSnippet && snippets.length > 0) {
      const snippetExists = snippets.find(s => s.id === selectedSnippet.id);
      if (!snippetExists) {
        console.log('Selected snippet no longer exists, selecting first available');
        setSelectedSnippet(snippets[0]);
      }
    } else if (selectedSnippet && snippets.length === 0) {
      // Если нет сниппетов вообще, очищаем selectedSnippet
      console.log('No snippets available, clearing selectedSnippet');
      setSelectedSnippet(null);
    }
  }, [snippets, selectedSnippet]);

  // UI действия
  const handleAddSnippet = (): void => {
    setEditingSnippet(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditSnippet = (snippet: Snippet): void => {
    setEditingSnippet(snippet);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  };

  return {
    // State
    selectedSnippet,
    searchQuery,
    jsonPath,
    isModalOpen,
    editingSnippet,
    modalMode,
    
    // Actions
    setSelectedSnippet,
    setSearchQuery,
    setJsonPath,
    handleAddSnippet,
    handleEditSnippet,
    handleCloseModal
  };
};
