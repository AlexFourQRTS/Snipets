const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Проверка сборки проекта...');

try {
  // Проверяем TypeScript
  console.log('📝 Проверка TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript проверка прошла успешно');
} catch (error) {
  console.error('❌ Ошибки TypeScript:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

try {
  // Проверяем сборку React
  console.log('⚛️ Сборка React приложения...');
  execSync('npx react-scripts build', { stdio: 'pipe' });
  console.log('✅ React приложение собрано успешно');
} catch (error) {
  console.error('❌ Ошибки сборки React:');
  console.error(error.stdout?.toString() || error.message);
  process.exit(1);
}

// Проверяем, что build папка создана
if (fs.existsSync('build')) {
  console.log('✅ Папка build создана');
  
  // Проверяем основные файлы
  const requiredBuildFiles = [
    'build/index.html',
    'build/static/js/main.js',
    'build/static/css/main.css'
  ];
  
  requiredBuildFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - НЕ НАЙДЕН`);
    }
  });
} else {
  console.log('❌ Папка build не создана');
  process.exit(1);
}

console.log('🎉 Все проверки прошли успешно!');
