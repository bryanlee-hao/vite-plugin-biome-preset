import type { ResolvedConfig, ViteDevServer } from 'vite';
import { type BiomeRunnerOptions } from './biome-runner';
interface ViteBiomePluginOptions extends BiomeRunnerOptions {
}
declare const viteBiomePlugin: (options?: ViteBiomePluginOptions) => {
    name: string;
    configResolved(config: ResolvedConfig): void;
    buildStart(): Promise<void>;
    configureServer(server: ViteDevServer): void;
    closeBundle(): Promise<void>;
};
export default viteBiomePlugin;
//# sourceMappingURL=vite-plugin-biome.d.ts.map