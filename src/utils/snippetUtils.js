// Утилиты для работы со сниппетами

export const createSnippet = (formData, existingSnippet = null) => {
  return {
    ...formData,
    language: 'Code',
    tags: [],
    category: 'General',
    id: existingSnippet?.id || Date.now(),
    date: existingSnippet?.date || new Date().toISOString().split('T')[0],
    views: existingSnippet?.views || '0'
  };
};

export const updateSnippet = (snippets, snippetId, field, value) => {
  return snippets.map(snippet => 
    snippet.id === snippetId 
      ? { ...snippet, [field]: value }
      : snippet
  );
};

export const deleteSnippet = (snippets, snippetId) => {
  return snippets.filter(s => s.id !== snippetId);
};

export const moveSnippet = (snippets, snippetId, fromCategory, toCategory) => {
  return snippets.map(snippet => 
    snippet.id === snippetId 
      ? { ...snippet, category: toCategory }
      : snippet
  );
};

export const renameSnippet = (snippets, snippetId, newTitle) => {
  return snippets.map(snippet => 
    snippet.id === snippetId 
      ? { ...snippet, title: newTitle }
      : snippet
  );
};

export const deleteCategory = (snippets, categoryName) => {
  return snippets.filter(s => s.category !== categoryName);
};

export const renameCategory = (snippets, oldCategory, newCategory) => {
  return snippets.map(snippet => 
    snippet.category === oldCategory 
      ? { ...snippet, category: newCategory }
      : snippet
  );
};

export const createCategory = (snippets, categoryName) => {
  const exampleSnippet = {
    id: Date.now(),
    title: 'Example Snippet',
    language: 'Code',
    code: `// Example code for ${categoryName} category
console.log('Hello from ${categoryName}!');

// Add your code here...`,
    notes: `**Example snippet for ${categoryName} category:**

- This is a placeholder snippet
- Replace this content with your actual code
- Add notes and documentation as needed`,
    tags: [],
    category: categoryName,
    date: new Date().toISOString().split('T')[0],
    views: '0'
  };

  return [...snippets, exampleSnippet];
};
