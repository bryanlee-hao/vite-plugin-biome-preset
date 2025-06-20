import type { ResolvedConfig, ViteDevServer } from 'vite'
import { BiomeRunner, type BiomeRunnerOptions } from './biome-runner'

interface ViteBiomePluginOptions extends BiomeRunnerOptions {
  // 可以添加 Vite 插件特有的选项
}

// Biome Vite 插件
const viteBiomePlugin = (options: ViteBiomePluginOptions = {}) => {
  let isWatchMode = false
  const biomeRunner = new BiomeRunner(options)

  return {
    name: 'biome-plugin',

    configResolved(config: ResolvedConfig) {
      // 检查是否在 watch 模式
      isWatchMode = config.command === 'serve' || process.argv.includes('--watch')
      console.log(`🔧 Biome 插件已加载 - Watch 模式: ${isWatchMode ? '开启' : '关闭'}`)
    },

    async buildStart() {
      if (options.formatOnSave) {
        await biomeRunner.runFormat()
      } else {
        await biomeRunner.runLint()
      }
    },

    configureServer(server: ViteDevServer) {
      if (isWatchMode) {
        if (options.formatOnSave) {
          console.log('�� Biome formatOnSave 已启用')
        } else {
          console.log('👀 Biome lintOnSave 已启用')
        }

        // 监听文件变化
        server.watcher.on('change', async (file: string) => {
          if (biomeRunner.isBiomeFile(file)) {
            console.log(`📝 检测到文件变化: ${file}`)
            await biomeRunner.runOperation([file])
          }
        })

        // 监听文件添加
        server.watcher.on('add', async (file: string) => {
          if (biomeRunner.isBiomeFile(file)) {
            console.log(`📄 检测到新文件: ${file}`)
            await biomeRunner.runOperation([file])
          }
        })
      }
    },

    // 构建结束时执行
    async closeBundle() {
    },
  }
}

export default viteBiomePlugin
