import React, { useState } from 'react';

interface CreateCategoryFormProps {
  isVisible: boolean;
  onClose: () => void;
  onCreate: (categoryName: string) => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({
  isVisible,
  onClose,
  onCreate
}) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (): void => {
    if (categoryName.trim()) {
      onCreate(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="p-3 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Category name..."
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-1 bg-selection border border-gray-600 rounded text-text-primary text-sm focus:border-accent focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="px-2 py-1 bg-accent hover:bg-accent/80 text-white rounded text-sm"
        >
          ✓
        </button>
        <button
          onClick={onClose}
          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
