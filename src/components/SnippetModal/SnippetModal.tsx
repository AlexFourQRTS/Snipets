import React, { useState, useEffect } from 'react';
import { Snippet } from '../../types';
import { SnippetModalProps } from './types';
import { createEmptySnippet, validateSnippet } from './utils';

const SnippetModal: React.FC<SnippetModalProps> = ({ 
  isOpen, 
  onClose, 
  snippet, 
  onSave, 
  mode = 'add' 
}) => {
  const [formData, setFormData] = useState<Partial<Snippet>>({
    title: '',
    code: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (snippet) {
        setFormData({
          title: snippet.title || '',
          code: snippet.code || '',
          notes: snippet.notes || ''
        });
      } else {
        setFormData({
          title: '',
          code: '',
          notes: ''
        });
      }
    }
  }, [isOpen, snippet]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!validateSnippet(formData)) {
      alert('Пожалуйста, заполните все обязательные поля (Title, Code)');
      return;
    }
    
    const snippetData: Snippet = {
      ...createEmptySnippet(),
      ...formData,
      id: snippet?.id || Date.now(),
      date: snippet?.date || new Date().toISOString().split('T')[0],
      views: snippet?.views || '0'
    };

    onSave(snippetData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-panel rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">
            {mode === 'add' ? 'Add New Snippet' : 'Edit Snippet'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-selection border border-gray-600 rounded text-text-primary focus:border-accent focus:outline-none"
              placeholder="Enter snippet title..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Code</label>
            <textarea
              name="code"
              value={formData.code || ''}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-3 py-2 bg-selection border border-gray-600 rounded text-text-primary focus:border-accent focus:outline-none font-code"
              placeholder="Paste your code here..."
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Notes (Markdown supported)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-selection border border-gray-600 rounded text-text-primary focus:border-accent focus:outline-none"
              placeholder="Add notes, documentation, or usage examples..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded transition-colors"
            >
              {mode === 'add' ? 'Add Snippet' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SnippetModal;
