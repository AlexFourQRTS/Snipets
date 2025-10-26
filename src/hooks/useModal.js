import { useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const openModal = (snippet = null, mode = 'add') => {
    setEditingSnippet(snippet);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  };

  return {
    isModalOpen,
    editingSnippet,
    modalMode,
    openModal,
    closeModal
  };
};
