import { Snippet } from '../../types';

export interface RightPanelProps {
  selectedSnippet: Snippet | null;
  onUpdateSnippet: (snippetId: number, field: keyof Snippet, value: any) => void;
  onDeleteSnippet: (snippetId: number) => void;
  snippets: Snippet[];
}

export interface RightPanelState {
  editingField: keyof Snippet | null;
  editValue: string;
  isEditing: boolean;
  hasChanges: boolean;
  lastSnippetId: number | null;
}

