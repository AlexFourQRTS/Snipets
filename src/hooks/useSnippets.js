import { useState, useEffect, useCallback } from 'react';
import { snippetsData } from '../data/snippets';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [currentFilePath, setCurrentFilePath] = useState('');

  // Инициализация с дефолтным файлом
  useEffect(() => {
    const initializeDefaultFile = async () => {
      if (window.electronAPI && window.electronAPI.getDefaultFilePath) {
        try {
          // Сначала пытаемся загрузить сохраненный путь к базе по умолчанию
          let defaultPath;
          if (window.electronAPI.getSavedDefaultDatabase) {
            const savedPath = await window.electronAPI.getSavedDefaultDatabase();
            if (savedPath) {
              defaultPath = savedPath;
            }
          }
          
          // Если нет сохраненного пути, используем системный дефолтный
          if (!defaultPath) {
            defaultPath = await window.electronAPI.getDefaultFilePath();
          }
          
          setCurrentFilePath(defaultPath);
          
          // Пытаемся загрузить дефолтный файл
          const result = await window.electronAPI.loadJsonFile(defaultPath);
          if (result.success) {
            setSnippets(result.data);
          } else {
            // Если файл не существует, пустой или содержит ошибки, создаем с данными по умолчанию
            console.log('Default file error:', result.error);
            await saveToFile(snippetsData, defaultPath);
            setSnippets(snippetsData);
          }
        } catch (error) {
          console.error('Error initializing default file:', error);
          setSnippets(snippetsData);
        }
      } else {
        setSnippets(snippetsData);
      }
    };
    
    initializeDefaultFile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Функция сохранения в файл
  const saveToFile = useCallback(async (data, filePath = currentFilePath, showToast = true) => {
    if (!filePath || !window.electronAPI?.saveJsonFile) {
      return false;
    }

    try {
      const result = await window.electronAPI.saveJsonFile(filePath, data);
      return result.success;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  }, [currentFilePath]);

  return {
    snippets,
    setSnippets,
    selectedSnippet,
    setSelectedSnippet,
    currentFilePath,
    setCurrentFilePath,
    saveToFile
  };
};
