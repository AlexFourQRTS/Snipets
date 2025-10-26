import { Snippet } from '../../../types';

// Утилиты для работы с модальным окном сниппетов

export const createEmptySnippet = (): Snippet => {
  return {
    id: Date.now(),
    title: '',
    code: '',
    notes: '',
    language: 'Code',
    category: 'General',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    views: '0'
  };
};

export const validateSnippet = (snippet: Partial<Snippet>): boolean => {
  return !!(snippet.title?.trim() && snippet.code?.trim());
};

export const validateSnippetForm = (formData: Partial<Snippet>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!formData.code?.trim()) {
    errors.push('Code is required');
  }
  
  if (formData.title && formData.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (formData.code && formData.code.length > 10000) {
    errors.push('Code must be less than 10,000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateSnippetId = (): number => {
  return Date.now() + Math.random();
};

export const formatSnippetForSave = (formData: Partial<Snippet>, existingSnippet?: Snippet): Snippet => {
  const now = new Date().toISOString().split('T')[0];
  
  return {
    id: existingSnippet?.id || generateSnippetId(),
    title: formData.title || '',
    code: formData.code || '',
    notes: formData.notes || '',
    language: formData.language || 'Code',
    category: formData.category || 'General',
    tags: formData.tags || [],
    date: existingSnippet?.date || now,
    views: existingSnippet?.views || '0'
  };
};

export const getSnippetPreview = (snippet: Partial<Snippet>, maxLength: number = 150): string => {
  const code = snippet.code?.trim() || '';
  if (code.length <= maxLength) {
    return code;
  }
  return code.substring(0, maxLength) + '...';
};

export const getFormattedDate = (date?: string): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export const sanitizeSnippetData = (snippet: Partial<Snippet>): Partial<Snippet> => {
  return {
    ...snippet,
    title: snippet.title?.trim() || '',
    code: snippet.code?.trim() || '',
    notes: snippet.notes?.trim() || '',
    language: snippet.language?.trim() || 'Code',
    category: snippet.category?.trim() || 'General',
    tags: Array.isArray(snippet.tags) ? snippet.tags.filter((tag: any) => typeof tag === 'string' && tag.trim()) : []
  };
};
