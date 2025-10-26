import { useState, useEffect } from 'react';
import { Snippet } from '../../../types';
import { snippetsData } from '../../../data/snippets';

export const useAppData = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string>('');

  // Инициализация с дефолтным файлом
  useEffect(() => {
    const initializeDefaultFile = async () => {
      console.log('Initializing app...');
      console.log('window.electronAPI exists:', !!window.electronAPI);
      console.log('getDefaultFilePath exists:', !!window.electronAPI?.getDefaultFilePath);
      
      if (window.electronAPI && window.electronAPI.getDefaultFilePath) {
        try {
          // Сначала пытаемся загрузить сохраненный путь к базе по умолчанию
          let defaultPath: string | null = null;
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
          console.log('Set currentFilePath to:', defaultPath);
          
          // Пытаемся загрузить дефолтный файл
          const result = await window.electronAPI.loadJsonFile(defaultPath);
          if (result.success && result.data) {
            setSnippets(result.data);
            console.log('✅ Загружен файл данных');
          } else {
            // Если файл не существует, пустой или содержит ошибки, создаем с данными по умолчанию
            console.log('Default file error:', result.error);
            await saveToFile(snippetsData, defaultPath);
            setSnippets(snippetsData);
            console.log('✅ Создан файл данных');
          }
        } catch (error) {
          console.error('Error initializing default file:', error);
          setSnippets(snippetsData);
        }
      } else {
        console.log('Running in browser mode (no Electron API)');
        setSnippets(snippetsData);
      }
    };
    
    initializeDefaultFile();
  }, []);

  // Функция сохранения в файл
  const saveToFile = async (data: Snippet[], filePath: string = currentFilePath, showToast: boolean = true): Promise<boolean> => {
    console.log('saveToFile called:', { filePath, currentFilePath, showToast });
    console.log('window.electronAPI exists:', !!window.electronAPI);
    console.log('saveJsonFile exists:', !!window.electronAPI?.saveJsonFile);
    
    if (!filePath || !window.electronAPI?.saveJsonFile) {
      console.error('Cannot save: no file path or electronAPI');
      console.error('filePath:', filePath);
      console.error('electronAPI:', window.electronAPI);
      return false;
    }

    try {
      console.log('Attempting to save to:', filePath);
      const result = await window.electronAPI.saveJsonFile(filePath, data);
      console.log('Save result:', result);
      
      if (result.success) {
        console.log('✅ Данные успешно сохранены в файл:', filePath);
        return true;
      } else {
        console.error('❌ Ошибка сохранения:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  return {
    snippets,
    setSnippets,
    currentFilePath,
    setCurrentFilePath,
    saveToFile
  };
};
