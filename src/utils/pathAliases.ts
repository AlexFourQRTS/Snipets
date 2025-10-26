// Пример использования алиасов путей
import { Snippet } from '@/types';
import { useSnippets } from '@/hooks/useSnippets';
import LeftPanel from '@/components/LeftPanel';
import { snippetsData } from '@/data/snippets';

// Функция для демонстрации работы алиасов
export const demonstrateAliases = () => {
  console.log('Алиасы путей работают корректно!');
  console.log('Snippets data:', snippetsData);
  
  return {
    types: 'Импорт типов через @/types',
    hooks: 'Импорт хуков через @/hooks', 
    components: 'Импорт компонентов через @/components',
    data: 'Импорт данных через @/data'
  };
};

// Экспорт для использования в других файлах
export default demonstrateAliases;
