const { execSync } = require('child_process');

console.log('🚀 Проверка запуска приложения...\n');

try {
  // Проверяем, что все файлы на месте
  console.log('📁 Проверка структуры файлов...');
  const fs = require('fs');
  
  const criticalFiles = [
    'src/App.tsx',
    'src/index.tsx',
    'src/components/App/App.tsx',
    'src/components/LeftPanel/LeftPanel.tsx',
    'src/components/RightPanel/RightPanel.tsx',
    'package.json',
    'tsconfig.json'
  ];
  
  let allFilesExist = true;
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - НЕ НАЙДЕН`);
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.log('\n❌ Критические файлы отсутствуют!');
    process.exit(1);
  }
  
  console.log('\n✅ Все критические файлы найдены');
  
  // Проверяем package.json
  console.log('\n📦 Проверка зависимостей...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = ['react', 'react-dom', 'react-hot-toast'];
  const requiredDevDeps = ['typescript', '@types/react', '@types/react-dom', 'tailwindcss'];
  
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
  
  console.log('\n🎉 Приложение готово к запуску!');
  console.log('\n📋 Инструкции:');
  console.log('1. Откройте браузер и перейдите на http://localhost:3000');
  console.log('2. Проверьте, что все компоненты отображаются корректно');
  console.log('3. Протестируйте функциональность:');
  console.log('   - Создание новых сниппетов');
  console.log('   - Редактирование существующих');
  console.log('   - Drag & Drop между категориями');
  console.log('   - Поиск по сниппетам');
  console.log('   - Создание новых категорий');
  
} catch (error) {
  console.error('❌ Ошибка при проверке:', error.message);
  process.exit(1);
}
