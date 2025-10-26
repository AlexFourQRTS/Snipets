const { spawn } = require('child_process');
const path = require('path');

console.log('Запуск Electron...');

// Запуск Electron с правильным путем
const electron = spawn('npx', ['electron', path.join(__dirname, 'electron', 'main.js')], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

electron.on('close', (code) => {
  console.log(`Electron завершен с кодом ${code}`);
});

electron.on('error', (err) => {
  console.error('Ошибка запуска Electron:', err);
});
