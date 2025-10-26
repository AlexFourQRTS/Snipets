const { spawn } = require('child_process');
const path = require('path');

// Запуск React dev server
const reactServer = spawn('npm', ['start'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true
});

// Небольшая задержка перед запуском Electron
setTimeout(() => {
  // Запуск Electron
  const electron = spawn('npm', ['run', 'electron-dev'], {
    cwd: path.join(__dirname),
    stdio: 'inherit',
    shell: true
  });

  electron.on('close', () => {
    console.log('Electron закрыт, останавливаем React сервер...');
    reactServer.kill();
    process.exit();
  });
}, 3000); // 3 секунды на запуск React сервера

// Обработка закрытия процесса
process.on('SIGINT', () => {
  console.log('\nОстанавливаем все процессы...');
  reactServer.kill();
  process.exit();
});
