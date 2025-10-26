const { execSync } = require('child_process');

try {
  console.log('Проверка TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript проверка прошла успешно');
} catch (error) {
  console.error('❌ Ошибки TypeScript:', error.message);
  process.exit(1);
}
