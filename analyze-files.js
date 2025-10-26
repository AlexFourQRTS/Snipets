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
          name: item
        });
      }
    }
  }
  
  scanDir(dir);
  return files.sort((a, b) => b.lines - a.lines);
}

console.log('📊 Анализ размеров файлов в проекте...\n');

const srcFiles = analyzeDirectory('src');
const electronFiles = analyzeDirectory('electron', ['.js']);

console.log('🔍 React/TypeScript файлы (src/):');
console.log('='.repeat(60));
srcFiles.forEach(file => {
  const status = file.lines > 200 ? '🔴' : file.lines > 100 ? '🟡' : '🟢';
  console.log(`${status} ${file.lines.toString().padStart(4)} строк - ${file.path}`);
});

console.log('\n🔍 Electron файлы:');
console.log('='.repeat(60));
electronFiles.forEach(file => {
  const status = file.lines > 200 ? '🔴' : file.lines > 100 ? '🟡' : '🟢';
  console.log(`${status} ${file.lines.toString().padStart(4)} строк - ${file.path}`);
});

console.log('\n📋 Рекомендации по рефакторингу:');
console.log('='.repeat(60));

const largeFiles = [...srcFiles, ...electronFiles].filter(f => f.lines > 150);

if (largeFiles.length === 0) {
  console.log('✅ Все файлы имеют приемлемый размер!');
} else {
  largeFiles.forEach(file => {
    console.log(`🔴 ${file.path} (${file.lines} строк) - требует рефакторинга`);
  });
}

console.log('\n🎯 Критерии для рефакторинга:');
console.log('🔴 > 200 строк - обязательно разбить');
console.log('🟡 100-200 строк - рекомендуется разбить');
console.log('🟢 < 100 строк - хороший размер');
