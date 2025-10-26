import React, { useState, useRef, useEffect } from 'react';

interface CategoryHeaderProps {
  category: string;
  snippetCount: number;
  isExpanded: boolean;
  isRenaming: boolean;
  hasChanges: boolean;
  onToggle: () => void;
  onStartRename: () => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onChange: (value: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  snippetCount,
  isExpanded,
  isRenaming,
  hasChanges,
  onToggle,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onChange,
  onContextMenu
}) => {
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Фокус на поле ввода при переименовании
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      onSaveRename();
    } else if (e.key === 'Escape') {
      onCancelRename();
    }
  };

  return (
    <div 
      className="flex items-center justify-between px-3 py-2 hover:bg-selection cursor-pointer"
      onClick={onToggle}
      onDoubleClick={onStartRename}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center">
        <span className="text-text-secondary mr-2">
          {isExpanded ? '📂' : '📁'}
        </span>
        {isRenaming ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              ref={renameInputRef}
              type="text"
              defaultValue={category}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={onSaveRename}
              className="bg-transparent border-none outline-none text-sm text-text-primary flex-1"
            />
            {hasChanges && (
              <button
                onClick={onSaveRename}
                className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold transition-colors"
                title="Сохранить изменения"
              >
                ✓
              </button>
            )}
          </div>
        ) : (
          <>
            <span className="text-sm text-text-primary">{category}</span>
            <span className="text-xs text-text-secondary ml-2">({snippetCount})</span>
          </>
        )}
      </div>
      <span className="text-text-secondary text-xs">
        {isExpanded ? '▼' : '▶'}
      </span>
    </div>
  );
};

export default CategoryHeader;
