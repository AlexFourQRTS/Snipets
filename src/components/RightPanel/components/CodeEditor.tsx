import React, { useState, useRef, useEffect } from 'react';
import { Snippet } from '../../../types';
import CodeHighlighter from '../../CodeHighlighter';

interface CodeEditorProps {
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

const CodeEditor: React.FC<CodeEditorProps> = ({
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

  if (isEditing) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <textarea
          ref={editInputRef}
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full h-64 bg-transparent text-text-primary resize-none focus:outline-none font-mono text-sm leading-relaxed"
          placeholder="Enter your code here..."
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
      className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors"
      onDoubleClick={onStartEdit}
    >
      <pre className="text-text-primary whitespace-pre-wrap">
        <CodeHighlighter code={snippet.code} />
      </pre>
    </div>
  );
};

export default CodeEditor;
