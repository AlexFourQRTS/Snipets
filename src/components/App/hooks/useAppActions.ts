import { useCallback } from 'react';
import { Snippet } from '../../../types';
import { toast } from 'react-hot-toast';

interface UseAppActionsProps {
  snippets: Snippet[];
  setSnippets: (snippets: Snippet[]) => void;
  selectedSnippet: Snippet | null;
  setSelectedSnippet: (snippet: Snippet | null) => void;
  saveToFile: (data: Snippet[], filePath?: string, showToast?: boolean) => Promise<boolean>;
  currentFilePath: string;
}

export const useAppActions = ({
  snippets,
  setSnippets,
  selectedSnippet,
  setSelectedSnippet,
  saveToFile,
  currentFilePath
}: UseAppActionsProps) => {
  
  // CRUD функции для сниппетов
  const handleDeleteSnippet = useCallback(async (snippetId: number): Promise<void> => {
    if (window.confirm('⚠️ ВНИМАНИЕ: Вы уверены, что хотите удалить этот сниппет?')) {
      if (window.confirm('🚨 ПОДТВЕРЖДЕНИЕ: Это действие необратимо! Удалить сниппет навсегда?')) {
        const newSnippets = snippets.filter(s => s.id !== snippetId);
        setSnippets(newSnippets);
        
        if (selectedSnippet?.id === snippetId) {
          // Автоматически выбираем первый доступный сниппет
          if (newSnippets.length > 0) {
            setSelectedSnippet(newSnippets[0]);
          } else {
            setSelectedSnippet(null);
          }
        }
        
        // Автосохранение
        const saveResult = await saveToFile(newSnippets, currentFilePath, false);
        console.log('🗑️ Удаление сниппета:', { snippetId, saveResult });
        toast.success('Сниппет удален');
      }
    }
  }, [snippets, selectedSnippet, setSnippets, setSelectedSnippet, saveToFile, currentFilePath]);

  const handleSaveSnippet = useCallback(async (snippetData: Snippet, mode: 'add' | 'edit'): Promise<void> => {
    let newSnippets: Snippet[];
    
    if (mode === 'add') {
      newSnippets = [...snippets, snippetData];
    } else {
      newSnippets = snippets.map(s => s.id === snippetData.id ? snippetData : s);
      if (selectedSnippet?.id === snippetData.id) {
        setSelectedSnippet(snippetData);
      }
    }
    
    setSnippets(newSnippets);
    
    // Автосохранение
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('💾 Сохранение сниппета:', { 
      mode, 
      snippetId: snippetData.id, 
      saveResult 
    });
  }, [snippets, selectedSnippet, setSnippets, setSelectedSnippet, saveToFile, currentFilePath]);

  const handleUpdateSnippet = useCallback(async (snippetId: number, field: keyof Snippet, value: any): Promise<void> => {
    console.log('handleUpdateSnippet called:', { snippetId, field, value });
    console.log('Current snippets:', snippets);
    
    // Проверяем, существует ли сниппет с таким ID в текущем массиве
    const snippetExists = snippets.find(s => s.id === snippetId);
    if (!snippetExists) {
      console.error('Snippet not found in current snippets array:', snippetId);
      return;
    }
    
    const newSnippets = snippets.map(snippet => 
      snippet.id === snippetId 
        ? { ...snippet, [field]: value }
        : snippet
    );
    
    console.log('New snippets after update:', newSnippets);
    
    setSnippets(newSnippets);
    if (selectedSnippet?.id === snippetId) {
      const updatedSelectedSnippet = { ...selectedSnippet, [field]: value };
      setSelectedSnippet(updatedSelectedSnippet);
    }
    // Автосохранение без тостов
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('💾 Автосохранение сниппета:', { 
      snippetId, 
      field, 
      value, 
      saveResult 
    });
  }, [snippets, selectedSnippet, setSnippets, setSelectedSnippet, saveToFile, currentFilePath]);

  const handleMoveSnippet = useCallback(async (snippetId: number, fromCategory: string, toCategory: string): Promise<void> => {
    const newSnippets = snippets.map(snippet => 
      snippet.id === snippetId 
        ? { ...snippet, category: toCategory }
        : snippet
    );
    setSnippets(newSnippets);
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('🔄 Перемещение сниппета:', { 
      snippetId, 
      fromCategory, 
      toCategory, 
      saveResult 
    });
    toast.success(`Snippet moved from ${fromCategory} to ${toCategory}`);
  }, [snippets, setSnippets, saveToFile, currentFilePath]);

  const handleRenameSnippet = useCallback(async (snippetId: number, newTitle: string): Promise<void> => {
    const newSnippets = snippets.map(snippet => 
      snippet.id === snippetId 
        ? { ...snippet, title: newTitle }
        : snippet
    );
    setSnippets(newSnippets);
    if (selectedSnippet?.id === snippetId) {
      setSelectedSnippet({ ...selectedSnippet, title: newTitle });
    }
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('✏️ Переименование сниппета:', { 
      snippetId, 
      newTitle, 
      saveResult 
    });
  }, [snippets, selectedSnippet, setSnippets, setSelectedSnippet, saveToFile, currentFilePath]);

  // CRUD функции для категорий
  const handleDeleteCategory = useCallback(async (categoryName: string): Promise<void> => {
    if (window.confirm(`⚠️ ВНИМАНИЕ: Вы уверены, что хотите удалить категорию "${categoryName}"?`)) {
      if (window.confirm(`🚨 ПОДТВЕРЖДЕНИЕ: Это удалит ВСЕ сниппеты в категории "${categoryName}"! Действие необратимо!`)) {
        const newSnippets = snippets.filter(s => s.category !== categoryName);
        setSnippets(newSnippets);
        if (selectedSnippet?.category === categoryName) {
          // Автоматически выбираем первый доступный сниппет
          if (newSnippets.length > 0) {
            setSelectedSnippet(newSnippets[0]);
          } else {
            setSelectedSnippet(null);
          }
        }
        const saveResult = await saveToFile(newSnippets, currentFilePath, false);
        console.log('🗑️ Удаление категории:', { categoryName, saveResult });
        toast.success(`Категория "${categoryName}" и все её сниппеты удалены`);
      }
    }
  }, [snippets, selectedSnippet, setSnippets, setSelectedSnippet, saveToFile, currentFilePath]);

  const handleCreateCategory = useCallback(async (categoryName: string): Promise<void> => {
    // Создаем пример сниппета для новой категории
    const exampleSnippet: Snippet = {
      id: Date.now(),
      title: 'Example Snippet',
      language: 'Code',
      code: `// Example code for ${categoryName} category
console.log('Hello from ${categoryName}!');

// Add your code here...`,
      notes: `**Example snippet for ${categoryName} category:**

- This is a placeholder snippet
- Replace this content with your actual code
- Add notes and documentation as needed`,
      tags: [],
      category: categoryName,
      date: new Date().toISOString().split('T')[0],
      views: '0'
    };

    const newSnippets = [...snippets, exampleSnippet];
    setSnippets(newSnippets);
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('📁 Создание категории:', { 
      categoryName, 
      exampleSnippetId: exampleSnippet.id, 
      saveResult 
    });
    toast.success(`Category "${categoryName}" created with example snippet`);
  }, [snippets, setSnippets, saveToFile, currentFilePath]);

  const handleRenameCategory = useCallback(async (oldCategory: string, newCategory: string): Promise<void> => {
    const newSnippets = snippets.map(snippet => 
      snippet.category === oldCategory 
        ? { ...snippet, category: newCategory }
        : snippet
    );
    setSnippets(newSnippets);
    const saveResult = await saveToFile(newSnippets, currentFilePath, false);
    console.log('✏️ Переименование категории:', { 
      oldCategory, 
      newCategory, 
      saveResult 
    });
  }, [snippets, setSnippets, saveToFile, currentFilePath]);

  return {
    handleDeleteSnippet,
    handleSaveSnippet,
    handleUpdateSnippet,
    handleMoveSnippet,
    handleRenameSnippet,
    handleDeleteCategory,
    handleCreateCategory,
    handleRenameCategory
  };
};
