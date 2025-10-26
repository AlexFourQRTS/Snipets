import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppData } from './hooks/useAppData';
import { useAppUI } from './hooks/useAppUI';
import { useAppActions } from './hooks/useAppActions';
import AppHeader from './components/AppHeader';
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
  // Данные приложения
  const { snippets, setSnippets, currentFilePath, saveToFile } = useAppData();
  
  // UI состояние
  const {
    selectedSnippet,
    searchQuery,
    jsonPath,
    isModalOpen,
    editingSnippet,
    modalMode,
    setSelectedSnippet,
    setSearchQuery,
    setJsonPath,
    handleAddSnippet,
    handleEditSnippet,
    handleCloseModal
  } = useAppUI(snippets);

  // Действия приложения
  const {
    handleDeleteSnippet,
    handleSaveSnippet,
    handleUpdateSnippet,
    handleMoveSnippet,
    handleRenameSnippet,
    handleDeleteCategory,
    handleCreateCategory,
    handleRenameCategory
  } = useAppActions({
    snippets,
    setSnippets,
    selectedSnippet,
    setSelectedSnippet,
    saveToFile,
    currentFilePath
  });

  // Функция загрузки JSON файла
  const loadJsonFile = async (): Promise<void> => {
    if (!jsonPath.trim()) {
      return;
    }

    try {
      if (window.electronAPI && window.electronAPI.loadJsonFile) {
        const result = await window.electronAPI.loadJsonFile(jsonPath);
        
        if (result.success && result.data) {
          setSnippets(result.data);
          // setCurrentFilePath(jsonPath); // Это должно быть в useAppData
        } else {
          // Если файл пустой или содержит ошибки, записываем данные по умолчанию
          if (result.error?.includes('пустой') || result.error?.includes('Unexpected end')) {
            await saveToFile(snippets, jsonPath);
            setSnippets(snippets);
            // setCurrentFilePath(jsonPath);
          } else {
            throw new Error(result.error || 'Unknown error');
          }
        }
      }
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
  };

  return (
    <div className="h-screen bg-bg-main text-text-primary font-ui overflow-hidden">
      <AppHeader
        jsonPath={jsonPath}
        setJsonPath={setJsonPath}
        onLoadFile={loadJsonFile}
        currentFilePath={currentFilePath}
      />
      
      <AppLayout
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddSnippet={handleAddSnippet}
        snippets={snippets}
        onMoveSnippet={handleMoveSnippet}
        onEditSnippet={handleEditSnippet}
        onDeleteSnippet={handleDeleteSnippet}
        onDeleteCategory={handleDeleteCategory}
        onRenameSnippet={handleRenameSnippet}
        onRenameCategory={handleRenameCategory}
        onCreateCategory={handleCreateCategory}
        selectedSnippet={selectedSnippet}
        setSelectedSnippet={setSelectedSnippet}
        onUpdateSnippet={handleUpdateSnippet}
        isModalOpen={isModalOpen}
        onCloseModal={handleCloseModal}
        editingSnippet={editingSnippet}
        onSaveSnippet={(snippet) => handleSaveSnippet(snippet, modalMode)}
        modalMode={modalMode}
      />
      
      {/* Toast уведомления */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#21252b',
            color: '#abb2bf',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#56b6c2',
              secondary: '#21252b',
            },
          },
          error: {
            iconTheme: {
              primary: '#e06c75',
              secondary: '#21252b',
            },
          },
        }}
      />
    </div>
  );
};

export default App;