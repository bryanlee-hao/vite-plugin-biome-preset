import { execSync } from "child_process";
import { resolve } from "node:path";
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
  // 检查文件是否在 sourcePattern 范围内
  isFileInSourcePattern(file) {
    try {
      const resolvedFile = resolve(file);
      const resolvedSourcePattern = resolve(this.options.sourcePattern);
      if (!this.options.sourcePattern.startsWith("**")) {
        return resolvedFile.startsWith(resolvedSourcePattern);
      }
      return true;
    } catch {
      return false;
    }
  }
  // 过滤文件列表，只保留在 sourcePattern 中的文件
  getFormatFilesPaths(files) {
    if (files && files.length > 0 && !files[0].includes("**")) {
      const filteredFiles = files.filter((file) => this.isFileInSourcePattern(file));
      if (filteredFiles.length === 0) {
        console.log(`⚠️  没有文件在指定的 sourcePattern ${this.options.sourcePattern} 范围内`);
        return null;
      }
      return filteredFiles;
    } else {
      return [this.options.sourcePattern];
    }
  }
  // 运行 Biome format
  async runFormat(files) {
    try {
      const args = ["check", "--write", "--config-path", this.options.configPath];
      const filteredFiles = this.getFormatFilesPaths(files || []);
      if (!filteredFiles?.length) {
        return null;
      }
      args.push(...filteredFiles);
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
      const filteredFiles = this.getFormatFilesPaths(files || []);
      if (!filteredFiles?.length) {
        return null;
      }
      args.push(...filteredFiles);
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
