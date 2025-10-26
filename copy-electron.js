const fs = require('fs');
const path = require('path');

// Создаем директорию build если её нет
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Копируем electron файлы в build директорию
const electronDir = path.join(__dirname, 'electron');
const filesToCopy = [
  { src: 'main.js', dest: 'electron.js' },
  { src: 'preload.js', dest: 'preload.js' }
];

filesToCopy.forEach(({ src, dest }) => {
  const srcPath = path.join(electronDir, src);
  const destPath = path.join(buildDir, dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${src} to build directory as ${dest}`);
  } else {
    console.warn(`File ${src} not found in electron directory`);
  }
});

console.log('Electron files copied to build directory');
