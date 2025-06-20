import { BiomeRunner } from "./biome-runner.js";
const viteBiomePlugin = (options = {}) => {
  let isWatchMode = false;
  const biomeRunner = new BiomeRunner(options);
  return {
    name: "biome-plugin",
    configResolved(config) {
      isWatchMode = config.command === "serve" || process.argv.includes("--watch");
      console.log(`🔧 Biome 插件已加载 - Watch 模式: ${isWatchMode ? "开启" : "关闭"}`);
    },
    async buildStart() {
      if (options.formatOnSave) {
        await biomeRunner.runFormat();
      } else {
        await biomeRunner.runLint();
      }
    },
    configureServer(server) {
      if (isWatchMode) {
        if (options.formatOnSave) {
          console.log("�� Biome formatOnSave 已启用");
        } else {
          console.log("👀 Biome lintOnSave 已启用");
        }
        server.watcher.on("change", async (file) => {
          if (biomeRunner.isBiomeFile(file)) {
            console.log(`📝 检测到文件变化: ${file}`);
            await biomeRunner.runOperation([file]);
          }
        });
        server.watcher.on("add", async (file) => {
          if (biomeRunner.isBiomeFile(file)) {
            console.log(`📄 检测到新文件: ${file}`);
            await biomeRunner.runOperation([file]);
          }
        });
      }
    },
    // 构建结束时执行
    async closeBundle() {
    }
  };
};
export {
  viteBiomePlugin as default
};
//# sourceMappingURL=vite-plugin-biome.js.map
