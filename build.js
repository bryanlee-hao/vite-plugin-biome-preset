#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// 清理目录
function clean() {
  const esDir = path.join(__dirname, 'es');
  if (fs.existsSync(esDir)) {
    fs.rmSync(esDir, { recursive: true, force: true });
    success('清理 es 目录完成');
  }
}

// 复制配置文件
function copyConfig() {
  const sourceConfig = path.join(__dirname, 'default-biome.json');
  const targetConfig = path.join(__dirname, 'es', 'default-biome.json');
  
  if (fs.existsSync(sourceConfig)) {
    // 确保目标目录存在
    const targetDir = path.dirname(targetConfig);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    fs.copyFileSync(sourceConfig, targetConfig);
    success('复制配置文件完成');
  }
}

// 构建项目
function build() {
  try {
    info('开始构建项目...');
    
    // 清理
    clean();
    
    // 编译 TypeScript
    log('📦 编译 TypeScript...', colors.blue);
    execSync('npx tsc', { stdio: 'inherit' });
    success('TypeScript 编译完成');
    
    // 复制配置文件
    copyConfig();
    
    // 显示构建结果
    const esDir = path.join(__dirname, 'es');
    if (fs.existsSync(esDir)) {
      const files = fs.readdirSync(esDir, { recursive: true });
      log('\n📁 构建输出文件:', colors.blue);
      files.forEach(file => {
        if (typeof file === 'string') {
          log(`  - ${file}`, colors.green);
        }
      });
    }
    
    success('构建完成！');
    
  } catch (err) {
    error(`构建失败: ${err.message}`);
    process.exit(1);
  }
}

// 开发模式
function dev() {
  info('启动开发模式（监听文件变化）...');
  try {
    execSync('npx tsc --watch', { stdio: 'inherit' });
  } catch (err) {
    error(`开发模式启动失败: ${err.message}`);
    process.exit(1);
  }
}

// 主函数
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      build();
      break;
    case 'dev':
      dev();
      break;
    case 'clean':
      clean();
      break;
    default:
      log('🚀 Vite Biome Plugin 构建工具', colors.blue);
      log('');
      log('可用命令:', colors.yellow);
      log('  build  - 构建项目', colors.green);
      log('  dev    - 开发模式（监听文件变化）', colors.green);
      log('  clean  - 清理构建目录', colors.green);
      log('');
      log('示例:', colors.yellow);
      log('  node build.js build', colors.green);
      log('  node build.js dev', colors.green);
      break;
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  build,
  dev,
  clean
}; 