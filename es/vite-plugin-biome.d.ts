import type { Plugin } from 'vite';
import { type BiomeRunnerOptions } from './biome-runner';
interface ViteBiomePluginOptions extends BiomeRunnerOptions {
}
declare const viteBiomePlugin: (options?: ViteBiomePluginOptions) => Plugin;
export default viteBiomePlugin;
//# sourceMappingURL=vite-plugin-biome.d.ts.map