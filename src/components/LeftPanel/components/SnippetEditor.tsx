import React, { useState, useRef, useEffect } from 'react';
import { Snippet } from '../../../types';

interface SnippetEditorProps {
  snippet: Snippet;
  onSave: (snippetId: number, newTitle: string) => void;
  onCancel: () => void;
}

const SnippetEditor: React.FC<SnippetEditorProps> = ({
  snippet,
  onSave,
  onCancel
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isStable, setIsStable] = useState(true);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleRenameChange = (value: string): void => {
    setHasChanges(value.trim() !== snippet.title.trim());
  };

  const handleSaveRename = (): void => {
    if (hasChanges && isStable) {
      setIsStable(false);
      const input = renameInputRef.current;
      if (input && input.value.trim()) {
        onSave(snippet.id, input.value.trim());
      }
      setHasChanges(false);
      setTimeout(() => setIsStable(true), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  // Фокус на поле ввода при переименовании
  useEffect(() => {
    if (renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, []);

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        ref={renameInputRef}
        type="text"
        defaultValue={snippet.title}
        onChange={(e) => handleRenameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSaveRename}
        className="bg-transparent border-none outline-none text-sm flex-1"
      />
      {hasChanges && (
        <button
          onClick={handleSaveRename}
          className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold transition-colors"
          title="Сохранить изменения"
        >
          ✓
        </button>
      )}
    </div>
  );
};

export default SnippetEditor;
