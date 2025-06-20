import { execSync } from 'child_process'

export interface BiomeRunnerOptions {
  formatOnSave?: boolean
  extensions?: string[]
  sourcePattern?: string
  configPath?: string
}

export class BiomeRunner {
  private options: Required<BiomeRunnerOptions>

  constructor(options: BiomeRunnerOptions = {}) {
    this.options = {
      formatOnSave: options.formatOnSave ?? false,
      extensions: options.extensions ?? ['.js', '.ts', '.jsx', '.tsx', '.vue'],
      sourcePattern: options.sourcePattern ?? './src',
      configPath: options.configPath ?? 'biome.json',
    }
  }

  // 检查文件是否需要 Biome 处理
  isBiomeFile(file: string): boolean {
    return (
      this.options.extensions.some((ext) => file.endsWith(ext)) &&
      !file.includes('node_modules') &&
      !file.includes('.git')
    )
  }

  // 运行 Biome format
  async runFormat(files?: string[]): Promise<string | null> {
    try {
      const args = ['check', '--write', '--config-path', this.options.configPath]

      // 如果指定了具体文件，则使用文件路径，否则使用默认模式
      if (files && files.length > 0 && !files[0].includes('**')) {
        args.push(...files)
      } else {
        args.push(this.options.sourcePattern)
      }

      console.log(`🔄 执行 Biome format: biome ${args.join(' ')}`)

      const result = execSync(`npx biome ${args.join(' ')}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })

      console.log('✅ Biome format 完成')
      return result
    } catch (error: any) {
      if (error.stdout) {
        console.log('📝 Biome format 输出:', error.stdout)
      }
      if (error.stderr) {
        // console.log('⚠️  Biome format 警告:', error.stderr)
      }
      console.log('✅ Biome format 完成（可能有警告）')
      return null
    }
  }

  // 运行 Biome lint
  async runLint(files?: string[]): Promise<string | null> {
    try {
      const args = ['lint', '--config-path', this.options.configPath]

      // 如果指定了具体文件，则使用文件路径，否则使用默认模式
      if (files && files.length > 0 && !files[0].includes('**')) {
        args.push(...files)
      } else {
        args.push(this.options.sourcePattern)
      }

      console.log(`🔍 执行 Biome lint: biome ${args.join(' ')}`)

      const result = execSync(`npx biome ${args.join(' ')}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })

      console.log('✅ Biome lint 完成')
      return result
    } catch (error: any) {
      if (error.stdout) {
        console.log('📝 Biome lint 输出:', error.stdout)
      }
      if (error.stderr) {
        // console.log('⚠️  Biome lint 警告:', error.stderr)
      }
      console.log('✅ Biome lint 完成（可能有警告）')
      return null
    }
  }

  // 根据配置运行相应的操作
  async runOperation(files?: string[]): Promise<void> {
    if (this.options.formatOnSave) {
      await this.runFormat(files)
    } else {
      await this.runLint(files)
    }
  }

  // 运行完整的检查和格式化
  async runFullCheck(): Promise<void> {
    await this.runFormat()
    await this.runLint()
  }
}
