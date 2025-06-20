export interface BiomeRunnerOptions {
    formatOnSave?: boolean;
    extensions?: string[];
    sourcePattern?: string;
    configPath?: string;
}
export declare class BiomeRunner {
    private options;
    constructor(options?: BiomeRunnerOptions);
    isBiomeFile(file: string): boolean;
    runFormat(files?: string[]): Promise<string | null>;
    runLint(files?: string[]): Promise<string | null>;
    runOperation(files?: string[]): Promise<void>;
    runFullCheck(): Promise<void>;
}
//# sourceMappingURL=biome-runner.d.ts.map