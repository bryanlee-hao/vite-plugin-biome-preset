# Vite Biome 插件

一个将 [Biome](https://biomejs.dev/) 集成到 [Vite](https://vitejs.dev/) 构建工具中的插件，提供实时代码格式化和代码检查功能。

## 🚀 特性

- **实时格式化**: 在开发模式下自动格式化保存的文件
- **代码检查**: 集成 Biome 的 linting 功能
- **文件监听**: 自动监听文件变化并执行相应操作
- **可配置**: 支持自定义 Biome 配置和插件选项
- **TypeScript 支持**: 完整的 TypeScript 类型定义
- **多文件格式支持**: 支持 `.js`, `.ts`, `.jsx`, `.tsx`, `.vue` 等文件

## 📦 安装

```bash
npm install vite-plugin-biome-preset
# 或
yarn add vite-plugin-biome-preset
# 或
pnpm add vite-plugin-biome-preset
```

## 🔧 使用方法

### 基本配置

在你的 `vite.config.ts` 文件中添加插件：

```typescript
import { defineConfig } from 'vite'
import biomePlugin from 'vite-plugin-biome-preset'

export default defineConfig({
  plugins: [
    biomePlugin({
      formatOnSave: true, // 启用保存时格式化
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'], // 支持的文件扩展名
      sourcePattern: './src', // 源代码目录
      configPath: 'biome.json' // Biome 配置文件路径
    })
  ]
})
```

### 插件选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `formatOnSave` | `boolean` | `false` | 是否在保存时自动格式化文件 |
| `extensions` | `string[]` | `['.js', '.ts', '.jsx', '.tsx', '.vue']` | 支持的文件扩展名 |
| `sourcePattern` | `string` | `'./src'` | 源代码目录模式 |
| `configPath` | `string` | `'biome.json'` | Biome 配置文件路径 |

### Biome 配置

项目包含一个默认的 Biome 配置文件 `default-biome.json`，你可以复制到项目根目录并重命名为 `biome.json`：

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "overrides": [
    {
      "includes": [
        "**/*.vue",
        "**/*.ts",
        "**/*.tsx",
        "**/*.js",
        "**/*.jsx"
      ],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off"
          },
          "correctness": {
            "noUnusedVariables": "off",
            "noUnusedImports": "off"
          },
          "suspicious": {
            "noExplicitAny": "off"
          },
          "complexity": {
            "useOptionalChain": "off"
          }
        }
      }
    }
  ],
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "lineWidth": 120
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "json": {
    "formatter": {
      "enabled": false
    }
  }
}
```

## 🎯 功能说明

### 开发模式

在开发模式下，插件会：

1. **监听文件变化**: 当检测到支持的文件发生变化时，自动执行格式化或检查
2. **实时反馈**: 在控制台显示操作状态和结果
3. **智能过滤**: 自动忽略 `node_modules` 和 `.git` 目录

### 构建模式

在构建模式下，插件会：

1. **构建前检查**: 在构建开始前执行一次完整的代码检查
2. **确保代码质量**: 帮助在构建前发现潜在问题

## 📝 使用示例

### 仅启用代码检查

```typescript
import { defineConfig } from 'vite'
import biomePlugin from 'vite-plugin-biome-preset'

export default defineConfig({
  plugins: [
    biomePlugin({
      formatOnSave: false, // 禁用自动格式化
      sourcePattern: './src/**/*' // 检查 src 目录下的所有文件
    })
  ]
})
```

### 启用自动格式化

```typescript
import { defineConfig } from 'vite'
import biomePlugin from 'vite-plugin-biome-preset'

export default defineConfig({
  plugins: [
    biomePlugin({
      formatOnSave: true, // 启用自动格式化
      extensions: ['.js', '.ts', '.jsx', '.tsx'], // 仅支持 JavaScript/TypeScript 文件
      configPath: './config/biome.json' // 自定义配置文件路径
    })
  ]
})
```

## 🔍 控制台输出

插件会在控制台显示详细的操作信息：

```
🔧 Biome 插件已加载 - Watch 模式: 开启
📝 检测到文件变化: /path/to/your/file.ts
🔄 执行 Biome format: biome check --write --config-path biome.json /path/to/your/file.ts
✅ Biome format 完成
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Biome 官方文档](https://biomejs.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [Biome GitHub](https://github.com/biomejs/biome) 