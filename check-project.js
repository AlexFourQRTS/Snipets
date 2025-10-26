const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка структуры проекта...');

// Проверяем основные файлы
const requiredFiles = [
  'src/App.tsx',
  'src/index.tsx',
  'src/types/index.ts',
  'src/components/App/App.tsx',
  'src/components/LeftPanel/LeftPanel.tsx',
  'src/components/RightPanel/RightPanel.tsx',
  'src/components/SnippetModal/SnippetModal.tsx',
  'src/components/CodeHighlighter/CodeHighlighter.tsx',
  'tsconfig.json',
  'tailwind.config.js',
  'package.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - НЕ НАЙДЕН`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('❌ Некоторые файлы отсутствуют!');
  process.exit(1);
}

console.log('✅ Все основные файлы найдены');

// Проверяем package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('📦 Проверка зависимостей...');

const requiredDeps = ['react', 'react-dom', 'react-hot-toast'];
const requiredDevDeps = ['@types/react', '@types/react-dom', 'typescript', 'tailwindcss'];

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - НЕ НАЙДЕН в dependencies`);
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - НЕ НАЙДЕН в devDependencies`);
  }
});

// Проверяем, что старые JS файлы удалены
const oldJsFiles = [
  'src/App.js',
  'src/index.js',
  'src/components/LeftPanel.js',
  'src/components/RightPanel.js',
  'src/components/SnippetModal.js',
  'src/components/CenterPanel.js',
  'src/components/JsonPathHeader.js',
  'src/components/CodeHighlighter.js',
  'src/reportWebVitals.js'
];

console.log('🗑️ Проверка удаления старых JS файлов...');
oldJsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`❌ ${file} - ВСЕ ЕЩЕ СУЩЕСТВУЕТ`);
  } else {
    console.log(`✅ ${file} - удален`);
  }
});

console.log('🎉 Проверка завершена!');
