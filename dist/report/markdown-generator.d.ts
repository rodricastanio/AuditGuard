import type { Finding, EngineFailure } from '../types/finding.js';
export type ReportLang = 'en' | 'es';
export declare function generateMarkdownReport(findings: Finding[], meta?: {
    repo?: string;
    branch?: string;
    commit?: string;
    scanPath?: string;
}, engineFailures?: EngineFailure[], lang?: ReportLang): string;
//# sourceMappingURL=markdown-generator.d.ts.map