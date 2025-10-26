const { spawn } = require('child_process');
const path = require('path');

console.log('Запуск React сервера...');

// Запуск React dev server
const reactServer = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Небольшая задержка перед запуском Electron
setTimeout(() => {
  console.log('Запуск Electron...');
  
  // Запуск Electron в режиме разработки
  const electron = spawn('npx', ['electron', path.join(__dirname, 'electron', 'main.js')], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electron.on('close', (code) => {
    console.log(`Electron завершен с кодом ${code}`);
    reactServer.kill();
    process.exit();
  });

  electron.on('error', (err) => {
    console.error('Ошибка запуска Electron:', err);
    reactServer.kill();
    process.exit(1);
  });
}, 5000); // 5 секунд на запуск React сервера

// Обработка закрытия процесса
process.on('SIGINT', () => {
  console.log('\nОстанавливаем все процессы...');
  reactServer.kill();
  process.exit();
});
