// 导出主插件
export { default as viteBiomePlugin } from './vite-plugin-biome'

// 导出类型定义
export type { BiomeRunnerOptions } from './biome-runner'
export { BiomeRunner } from './biome-runner'

// 默认导出插件
import viteBiomePlugin from './vite-plugin-biome'
export default viteBiomePlugin 