import { execSync } from 'child_process'
import { resolve } from 'node:path'

export interface BiomeRunnerOptions {
  formatOnSave?: boolean
  extensions?: string[]
  sourcePattern?: string
  configPath?: string
}

const biomeExecutable = 'biome'
export class BiomeRunner {
  private options: Required<BiomeRunnerOptions>

  constructor(options: BiomeRunnerOptions = {}) {
    this.options = {
      formatOnSave: options.formatOnSave ?? false,
      extensions: options.extensions ?? ['.js', '.ts', '.jsx', '.tsx', '.vue'],
      sourcePattern: options.sourcePattern ?? './src',
      configPath: options.configPath ?? './biome.json',
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

  // 检查文件是否在 sourcePattern 范围内
  private isFileInSourcePattern(file: string): boolean {
    try {
      const resolvedFile = resolve(file)
      const resolvedSourcePattern = resolve(this.options.sourcePattern)

      // 如果 sourcePattern 是相对路径，检查文件是否在该目录下
      if (!this.options.sourcePattern.startsWith('**')) {
        return resolvedFile.startsWith(resolvedSourcePattern)
      }

      // 如果 sourcePattern 包含通配符，这里可以添加更复杂的逻辑
      // 目前简单处理，假设是相对路径
      return true
    } catch {
      return false
    }
  }
  // 过滤文件列表，只保留在 sourcePattern 中的文件
  private getFormatFilesPaths(files: string[]) {
    // 如果指定了具体文件，则使用文件路径，否则使用默认模式
    if (files && files.length > 0 && !files[0].includes('**')) {
      // 过滤文件，只保留在 sourcePattern 中的文件
      const filteredFiles = files.filter(file => this.isFileInSourcePattern(file))
      if (filteredFiles.length === 0) {
        console.log(`⚠️  没有文件在指定的 sourcePattern ${this.options.sourcePattern} 范围内`)
        return null
      }
      return filteredFiles
    } else {
      return [this.options.sourcePattern]
    }
  }

  // 运行 Biome format
  async runFormat(files?: string[]): Promise<string | null> {
    try {
      const args = ['check', '--write', '--config-path', this.options.configPath]

      const filteredFiles = this.getFormatFilesPaths(files || [])
      if (!filteredFiles?.length) {
        return null
      }
      args.push(...filteredFiles)

      console.log(`🔄 执行 Biome format: ${biomeExecutable} ${args.join(' ')}`)

      const result = execSync(`${biomeExecutable} ${args.join(' ')}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })

      console.log('✅ Biome format 完成')
      return result
    } catch (error: any) {
      if (error.stderr) {
        console.log('⚠️  Biome format 警告:', error.stderr)
      } else if (error.stdout) {
        console.log('📝 Biome format 输出:', error.stdout)
      }
      console.log('✅ Biome format 完成（可能有警告）')
      return null
    }
  }

  // 运行 Biome lint
  async runLint(files?: string[]): Promise<string | null> {
    try {
      const args = ['lint', '--config-path', this.options.configPath]

      const filteredFiles = this.getFormatFilesPaths(files || [])
      if (!filteredFiles?.length) {
        return null
      }
      args.push(...filteredFiles)

      console.log(`🔄 执行 Biome lint: ${biomeExecutable} ${args.join(' ')}`)

      const result = execSync(`${biomeExecutable} ${args.join(' ')}`, {
        encoding: 'utf8',
        stdio: 'pipe',
      })

      console.log('✅ Biome lint 完成')
      return result
    } catch (error: any) {
      if (error.stderr) {
        console.log('⚠️  Biome lint 警告:', error.stderr)
      } else if (error.stdout) {
        console.log('📝 Biome lint 输出:', error.stdout)
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
