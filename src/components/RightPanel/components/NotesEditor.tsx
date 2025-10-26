import React, { useState, useRef, useEffect } from 'react';
import { Snippet } from '../../../types';

interface NotesEditorProps {
  snippet: Snippet;
  isEditing: boolean;
  editValue: string;
  hasChanges: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  snippet,
  isEditing,
  editValue,
  hasChanges,
  onStartEdit,
  onSave,
  onCancel,
  onChange,
  onKeyDown
}) => {
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const formatNotesForDisplay = (notes: string): string => {
    return notes
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  };

  if (isEditing) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <textarea
          ref={editInputRef}
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full h-32 bg-transparent text-text-primary resize-none focus:outline-none text-sm leading-relaxed"
          placeholder="Enter your notes here..."
        />
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!hasChanges}
            className={`px-3 py-1 rounded text-sm ${
              hasChanges
                ? 'bg-accent hover:bg-accent/80 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-900 rounded-lg p-4 text-text-primary leading-relaxed cursor-pointer hover:bg-gray-800 transition-colors"
      onDoubleClick={onStartEdit}
    >
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: formatNotesForDisplay(snippet.notes)
        }} 
      />
    </div>
  );
};

export default NotesEditor;
