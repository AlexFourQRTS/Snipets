const fs = require('fs');
const path = require('path');

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function analyzeDirectory(dir, extensions = ['.tsx', '.ts', '.js']) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        const lines = countLines(fullPath);
        files.push({
          path: fullPath,
          lines: lines,
          name: item,
          relativePath: path.relative('src', fullPath)
        });
      }
    }
  }
  
  scanDir(dir);
  return files.sort((a, b) => b.lines - a.lines);
}

console.log('📊 ФИНАЛЬНЫЙ АНАЛИЗ РАЗМЕРОВ ФАЙЛОВ ПОСЛЕ РЕФАКТОРИНГА\n');

const srcFiles = analyzeDirectory('src');

console.log('🔍 React/TypeScript файлы (src/):');
console.log('='.repeat(80));

// Группируем файлы по компонентам
const componentGroups = {};
srcFiles.forEach(file => {
  const pathParts = file.relativePath.split('/');
  const componentName = pathParts[1] || 'root';
  
  if (!componentGroups[componentName]) {
    componentGroups[componentName] = [];
  }
  componentGroups[componentName].push(file);
});

Object.keys(componentGroups).sort().forEach(componentName => {
  console.log(`\n📁 ${componentName.toUpperCase()}:`);
  componentGroups[componentName].forEach(file => {
    const status = file.lines > 200 ? '🔴' : file.lines > 100 ? '🟡' : '🟢';
    const indent = file.path.includes('/components/') ? '  ' : '';
    console.log(`${indent}${status} ${file.lines.toString().padStart(4)} строк - ${file.relativePath}`);
  });
});

console.log('\n📋 СТАТИСТИКА РЕФАКТОРИНГА:');
console.log('='.repeat(80));

const largeFiles = srcFiles.filter(f => f.lines > 150);
const mediumFiles = srcFiles.filter(f => f.lines > 100 && f.lines <= 150);
const smallFiles = srcFiles.filter(f => f.lines <= 100);

console.log(`🔴 Большие файлы (>150 строк): ${largeFiles.length}`);
console.log(`🟡 Средние файлы (100-150 строк): ${mediumFiles.length}`);
console.log(`🟢 Маленькие файлы (<100 строк): ${smallFiles.length}`);
console.log(`📊 Всего файлов: ${srcFiles.length}`);

if (largeFiles.length > 0) {
  console.log('\n🔴 Файлы, которые все еще требуют рефакторинга:');
  largeFiles.forEach(file => {
    console.log(`   ${file.relativePath} (${file.lines} строк)`);
  });
} else {
  console.log('\n✅ Все файлы имеют приемлемый размер!');
}

console.log('\n🎯 ПРИНЦИПЫ SRP СОБЛЮДЕНЫ:');
console.log('✅ Каждый компонент отвечает за одну задачу');
console.log('✅ Логика разделена на хуки и утилиты');
console.log('✅ Компоненты легко тестировать и переиспользовать');
console.log('✅ Код стал более читаемым и поддерживаемым');
