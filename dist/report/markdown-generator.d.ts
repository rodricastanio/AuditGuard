import type { Finding, EngineFailure } from '../types/finding.js';
export declare function generateMarkdownReport(findings: Finding[], meta?: {
    repo?: string;
    branch?: string;
    commit?: string;
    scanPath?: string;
}, engineFailures?: EngineFailure[]): string;
//# sourceMappingURL=markdown-generator.d.ts.map