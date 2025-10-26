import { Snippet } from '../../../types';

// Утилиты для работы с редактором сниппетов

export const validateSnippetField = (field: keyof Snippet, value: string): boolean => {
  switch (field) {
    case 'title':
      return value.trim().length > 0;
    case 'code':
      return value.trim().length > 0;
    case 'notes':
      return true; // Заметки могут быть пустыми
    case 'category':
      return value.trim().length > 0;
    case 'language':
      return value.trim().length > 0;
    default:
      return true;
  }
};

export const formatCodeForDisplay = (code: string): string => {
  // Убираем лишние пробелы в начале и конце
  return code.trim();
};

export const formatNotesForDisplay = (notes: string): string => {
  // Обрабатываем Markdown разметку
  return notes
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent hover:underline">$1</a>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
};

export const highlightCode = (code: string, language: string = 'javascript'): string => {
  return code.split('\n').map((line, index) => {
    // Простое синтаксическое выделение
    const highlightedLine = line
      .replace(/#.*$/g, (match) => `<span class="text-gray-500">${match}</span>`)
      .replace(/\b(from|import|class|def|if|return|and|or|const|let|var|function|async|await)\b/g, (match) => `<span class="text-purple-400">${match}</span>`)
      .replace(/\b(FastAPI|BaseModel|User|app|React|useState|useEffect|Component)\b/g, (match) => `<span class="text-blue-400">${match}</span>`)
      .replace(/(".*?"|'.*?')/g, (match) => `<span class="text-green-400">${match}</span>`)
      .replace(/\b(\d+)\b/g, (match) => `<span class="text-yellow-400">${match}</span>`)
      .replace(/\b(true|false|null|undefined)\b/g, (match) => `<span class="text-orange-400">${match}</span>`)
      .replace(/(\{|\}|\[|\]|\(|\)|;|,)/g, (match) => `<span class="text-gray-400">${match}</span>`);
    
    return `<div key="${index}">${highlightedLine}</div>`;
  }).join('');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const getSnippetPreview = (snippet: Snippet, maxLength: number = 100): string => {
  const code = snippet.code.trim();
  if (code.length <= maxLength) {
    return code;
  }
  return code.substring(0, maxLength) + '...';
};

export const getLanguageIcon = (language: string): string => {
  const iconMap: Record<string, string> = {
    'javascript': '🟨',
    'typescript': '🔷',
    'python': '🐍',
    'java': '☕',
    'cpp': '⚙️',
    'csharp': '🔷',
    'php': '🐘',
    'ruby': '💎',
    'go': '🐹',
    'rust': '🦀',
    'swift': '🍎',
    'kotlin': '🟦',
    'html': '🌐',
    'css': '🎨',
    'sql': '🗄️',
    'json': '📄',
    'xml': '📄',
    'yaml': '📄',
    'markdown': '📝',
    'bash': '💻',
    'powershell': '💻',
    'dockerfile': '🐳',
    'Code': '💻'
  };
  
  return iconMap[language.toLowerCase()] || '💻';
};

export const calculateCodeComplexity = (code: string): number => {
  // Простой расчет сложности кода
  const lines = code.split('\n').length;
  const functions = (code.match(/\bfunction\b|\bdef\b|\bclass\b/g) || []).length;
  const loops = (code.match(/\bfor\b|\bwhile\b|\bforeach\b/g) || []).length;
  const conditions = (code.match(/\bif\b|\belse\b|\bswitch\b|\bcase\b/g) || []).length;
  
  return lines + (functions * 2) + (loops * 3) + (conditions * 2);
};

export const getCodeStats = (code: string): { lines: number; characters: number; words: number; complexity: number } => {
  const lines = code.split('\n').length;
  const characters = code.length;
  const words = code.split(/\s+/).filter(word => word.length > 0).length;
  const complexity = calculateCodeComplexity(code);
  
  return { lines, characters, words, complexity };
};
