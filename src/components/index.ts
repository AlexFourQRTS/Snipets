// Главный экспорт всех компонентов
export { default as App } from './App';
export { default as LeftPanel } from './LeftPanel';
export { default as RightPanel } from './RightPanel';
export { default as SnippetModal } from './SnippetModal';
export { default as CodeHighlighter } from './CodeHighlighter';

// Экспорт типов (только основные типы из src/types)
export * from '../types';

// Экспорт типов компонентов (без дублирования)
export type { LeftPanelProps, LeftPanelState, DragData } from './LeftPanel/types';
export type { RightPanelProps, RightPanelState } from './RightPanel/types';
export type { SnippetModalProps } from './SnippetModal/types';
export type { CodeHighlighterProps } from './CodeHighlighter/types';
