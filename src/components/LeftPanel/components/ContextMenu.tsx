import React, { useRef, useEffect } from 'react';

interface ContextMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  type: 'snippet' | 'category' | null;
  onAction: (action: string) => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  x,
  y,
  type,
  onAction,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-bg-panel border border-gray-600 rounded shadow-lg py-1 z-50"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => onAction('delete')}
        className="w-full px-3 py-1 text-left text-sm text-red-400 hover:bg-red-500/20"
      >
        🗑️ Delete {type === 'snippet' ? 'Snippet' : 'Category'}
      </button>
    </div>
  );
};

export default ContextMenu;
