import { Snippet } from '../../../types';

// Утилиты для работы с данными приложения

export const generateId = (): number => {
  return Date.now() + Math.random();
};

export const createEmptySnippet = (): Snippet => {
  return {
    id: generateId(),
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

export const filterSnippets = (snippets: Snippet[], query: string): Snippet[] => {
  if (!query.trim()) return snippets;
  
  const searchLower = query.toLowerCase();
  return snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchLower) ||
    snippet.code.toLowerCase().includes(searchLower) ||
    snippet.notes.toLowerCase().includes(searchLower) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

export const groupSnippetsByCategory = (snippets: Snippet[]): Record<string, Snippet[]> => {
  return snippets.reduce((acc, snippet) => {
    const category = snippet.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(snippet);
    return acc;
  }, {} as Record<string, Snippet[]>);
};

export const getCategories = (snippets: Snippet[]): string[] => {
  const categories = new Set(snippets.map(s => s.category || 'General'));
  return Array.from(categories).sort();
};

export const sortSnippets = (snippets: Snippet[], sortBy: 'title' | 'date' | 'views' = 'title'): Snippet[] => {
  return [...snippets].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'views':
        const aViews = parseInt(a.views) || 0;
        const bViews = parseInt(b.views) || 0;
        return bViews - aViews;
      default:
        return 0;
    }
  });
};
