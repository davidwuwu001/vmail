import { copyFileSync } from 'fs';
import { join } from 'path';

// 复制 index.html 为 404.html 以支持 SPA 路由
const buildDir = join(process.cwd(), 'build', 'client');
const indexPath = join(buildDir, 'index.html');
const notFoundPath = join(buildDir, '404.html');

try {
  copyFileSync(indexPath, notFoundPath);
  console.log('✅ 已创建 404.html');
} catch (error) {
  console.error('❌ 创建 404.html 失败:', error);
  process.exit(1);
}
