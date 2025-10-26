import { Snippet } from '../../../types';

// Утилиты для работы с категориями и сниппетами

export const groupSnippetsByCategory = (snippets: Snippet[], searchQuery?: string): Record<string, Snippet[]> => {
  let filteredSnippets = snippets;
  
  // Фильтруем сниппеты по поисковому запросу
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredSnippets = snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(query) ||
      snippet.code.toLowerCase().includes(query) ||
      snippet.notes.toLowerCase().includes(query) ||
      snippet.category.toLowerCase().includes(query) ||
      snippet.language.toLowerCase().includes(query) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  return filteredSnippets.reduce((acc, snippet) => {
    const category = snippet.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(snippet);
    return acc;
  }, {} as Record<string, Snippet[]>);
};

export const getAllCategories = (snippets: Snippet[]): string[] => {
  const categories = new Set(snippets.map(s => s.category || 'General'));
  return Array.from(categories).sort();
};

export const filterSnippetsByCategory = (snippets: Snippet[], category: string): Snippet[] => {
  return snippets.filter(snippet => (snippet.category || 'General') === category);
};

export const getSnippetCountByCategory = (snippets: Snippet[], category: string): number => {
  return filterSnippetsByCategory(snippets, category).length;
};

export const validateCategoryName = (name: string, existingCategories: string[]): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length > 0 && !existingCategories.includes(trimmedName);
};

export const createCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Backend': '⚙️',
    'Frontend': '🎨',
    'Database': '🗄️',
    'Algorithms': '🧮',
    'General': '📄',
    'React': '⚛️',
    'JavaScript': '🟨',
    'Python': '🐍',
    'TypeScript': '🔷',
    'CSS': '🎨',
    'HTML': '🌐'
  };
  
  return iconMap[category] || '📁';
};

export const sortSnippetsInCategory = (snippets: Snippet[], sortBy: 'title' | 'date' | 'views' = 'title'): Snippet[] => {
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

export const getCategoryStats = (snippets: Snippet[]): Record<string, { count: number; totalViews: number }> => {
  const stats: Record<string, { count: number; totalViews: number }> = {};
  
  snippets.forEach(snippet => {
    const category = snippet.category || 'General';
    if (!stats[category]) {
      stats[category] = { count: 0, totalViews: 0 };
    }
    stats[category].count++;
    stats[category].totalViews += parseInt(snippet.views) || 0;
  });
  
  return stats;
};
