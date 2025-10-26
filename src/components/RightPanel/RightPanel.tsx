import React, { useState, useRef, useEffect } from 'react';
import { RightPanelProps } from './types';
import { Snippet } from '../../types';
import { copyToClipboard } from './utils';
import {
  SnippetHeader,
  CodeEditor,
  NotesEditor,
  SnippetStats
} from './components';

const RightPanel: React.FC<RightPanelProps> = ({ 
  selectedSnippet, 
  onUpdateSnippet, 
  onDeleteSnippet, 
  snippets = [] 
}) => {
  const [editingField, setEditingField] = useState<keyof Snippet | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [lastSnippetId, setLastSnippetId] = useState<number | null>(null);

  // Проверяем, что selectedSnippet существует в текущем массиве snippets
  const snippetExists = snippets.find(s => s.id === selectedSnippet?.id);
  const validSnippet = snippetExists || selectedSnippet;

  // Сброс состояния редактирования при смене сниппета
  useEffect(() => {
    if (selectedSnippet?.id !== lastSnippetId) {
      setEditingField(null);
      setIsEditing(false);
      setHasChanges(false);
      setLastSnippetId(selectedSnippet?.id || null);
    }
  }, [selectedSnippet?.id, lastSnippetId]);

  if (!validSnippet) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg">Select a snippet to view</p>
          <p className="text-sm opacity-60">Choose from the left panel</p>
        </div>
      </div>
    );
  }

  const handleDoubleClick = (field: keyof Snippet): void => {
    console.log('handleDoubleClick called:', { field, validSnippet: validSnippet?.id });
    if (!validSnippet) {
      console.log('Cannot edit: no validSnippet');
      return;
    }

    setEditingField(field);
    setEditValue(validSnippet[field] as string);
    setIsEditing(true);
    setHasChanges(false);
  };

  const handleSave = (): void => {
    if (!validSnippet || !editingField) return;

    console.log('Saving snippet:', { 
      snippetId: validSnippet.id, 
      field: editingField, 
      value: editValue 
    });

    onUpdateSnippet(validSnippet.id, editingField, editValue);
    setEditingField(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = (): void => {
    setEditingField(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleChange = (value: string): void => {
    setEditValue(value);
    // Отслеживаем изменения для активации кнопки сохранения
    const originalValue = validSnippet?.[editingField as keyof Snippet] as string || '';
    setHasChanges(value.trim() !== originalValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCopy = async (): Promise<void> => {
    if (validSnippet) {
      const success = await copyToClipboard(validSnippet.code);
      if (success) {
        console.log('Code copied to clipboard');
      } else {
        alert('Ошибка копирования в буфер обмена');
      }
    }
  };

  const handleDelete = (): void => {
    if (validSnippet) {
      onDeleteSnippet(validSnippet.id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-main">
      <SnippetHeader
        snippet={validSnippet}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Code Section */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Code</h3>
          <CodeEditor
            snippet={validSnippet}
            isEditing={editingField === 'code'}
            editValue={editValue}
            hasChanges={hasChanges}
            onStartEdit={() => handleDoubleClick('code')}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Notes</h3>
          <NotesEditor
            snippet={validSnippet}
            isEditing={editingField === 'notes'}
            editValue={editValue}
            hasChanges={hasChanges}
            onStartEdit={() => handleDoubleClick('notes')}
            onSave={handleSave}
            onCancel={handleCancel}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Statistics */}
        <SnippetStats snippet={validSnippet} />
      </div>
    </div>
  );
};

export default RightPanel;