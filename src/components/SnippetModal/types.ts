import { Snippet } from '../../types';

export interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippet: Snippet | null;
  onSave: (snippet: Snippet) => void;
  mode: 'add' | 'edit';
}
