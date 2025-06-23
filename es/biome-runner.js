import { execSync } from "child_process";
const biomeExecutable = "biome";
class BiomeRunner {
  constructor(options = {}) {
    this.options = {
      formatOnSave: options.formatOnSave ?? false,
      extensions: options.extensions ?? [".js", ".ts", ".jsx", ".tsx", ".vue"],
      sourcePattern: options.sourcePattern ?? "./src",
      configPath: options.configPath ?? "./biome.json"
    };
  }
  // 检查文件是否需要 Biome 处理
  isBiomeFile(file) {
    return this.options.extensions.some((ext) => file.endsWith(ext)) && !file.includes("node_modules") && !file.includes(".git");
  }
  // 运行 Biome format
  async runFormat(files) {
    try {
      const args = ["check", "--write", "--config-path", this.options.configPath];
      if (files && files.length > 0 && !files[0].includes("**")) {
        args.push(...files);
      } else {
        args.push(this.options.sourcePattern);
      }
      console.log(`🔄 执行 Biome format: ${biomeExecutable} ${args.join(" ")}`);
      const result = execSync(`${biomeExecutable} ${args.join(" ")}`, {
        encoding: "utf8",
        stdio: "pipe"
      });
      console.log("✅ Biome format 完成");
      return result;
    } catch (error) {
      if (error.stderr) {
        console.log("⚠️  Biome format 警告:", error.stderr);
      } else if (error.stdout) {
        console.log("📝 Biome format 输出:", error.stdout);
      }
      console.log("✅ Biome format 完成（可能有警告）");
      return null;
    }
  }
  // 运行 Biome lint
  async runLint(files) {
    try {
      const args = ["lint", "--config-path", this.options.configPath];
      if (files && files.length > 0 && !files[0].includes("**")) {
        args.push(...files);
      } else {
        args.push(this.options.sourcePattern);
      }
      console.log(`🔄 执行 Biome lint: ${biomeExecutable} ${args.join(" ")}`);
      const result = execSync(`${biomeExecutable} ${args.join(" ")}`, {
        encoding: "utf8",
        stdio: "pipe"
      });
      console.log("✅ Biome lint 完成");
      return result;
    } catch (error) {
      if (error.stderr) {
        console.log("⚠️  Biome lint 警告:", error.stderr);
      } else if (error.stdout) {
        console.log("📝 Biome lint 输出:", error.stdout);
      }
      console.log("✅ Biome lint 完成（可能有警告）");
      return null;
    }
  }
  // 根据配置运行相应的操作
  async runOperation(files) {
    if (this.options.formatOnSave) {
      await this.runFormat(files);
    } else {
      await this.runLint(files);
    }
  }
  // 运行完整的检查和格式化
  async runFullCheck() {
    await this.runFormat();
    await this.runLint();
  }
}
export {
  BiomeRunner
};
//# sourceMappingURL=biome-runner.js.map
