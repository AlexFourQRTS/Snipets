import React from 'react';
import { toast } from 'react-hot-toast';

interface AppHeaderProps {
  jsonPath: string;
  setJsonPath: (path: string) => void;
  onLoadFile: () => void;
  currentFilePath: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  jsonPath,
  setJsonPath,
  onLoadFile,
  currentFilePath
}) => {
  const handleBrowseFile = async (): Promise<void> => {
    if (window.electronAPI && window.electronAPI.openFile) {
      const filePath = await window.electronAPI.openFile();
      if (filePath) {
        setJsonPath(filePath);
      }
    } else {
      toast.error('Выбор файла доступен только в Electron приложении');
    }
  };

  const handleSetDefault = async (): Promise<void> => {
    if (jsonPath.trim()) {
      try {
        if (window.electronAPI && window.electronAPI.setDefaultDatabase) {
          await window.electronAPI.setDefaultDatabase(jsonPath);
          toast.success('База данных установлена как база по умолчанию');
        } else {
          toast.error('Функция доступна только в Electron приложении');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Ошибка сохранения: ${errorMessage}`);
      }
    } else {
      toast.error('Сначала укажите путь к файлу');
    }
  };

  return (
    <div className="bg-bg-panel border-b border-gray-700 p-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-text-secondary whitespace-nowrap">
          JSON Database:
        </label>
        <input
          type="text"
          placeholder="Path to JSON file"
          value={jsonPath}
          onChange={(e) => setJsonPath(e.target.value)}
          className="flex-1 px-3 py-2 bg-selection border border-gray-600 rounded text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none text-sm"
        />
        <button
          onClick={onLoadFile}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          📁 Load
        </button>
        <button
          onClick={handleBrowseFile}
          className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          📂 Browse
        </button>
        <button
          onClick={handleSetDefault}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          💾 База по умолчанию
        </button>
        {currentFilePath && (
          <div className="text-xs text-text-secondary">
            <span className="text-green-400">●</span> Используется дефолтный файл
          </div>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
