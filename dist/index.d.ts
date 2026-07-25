import type { Finding, Severity } from './types/finding.js';
import type { AuditGuardConfig } from './types/config.js';
export declare function runAudit(config: AuditGuardConfig): Promise<Finding[]>;
export declare function generateReport(findings: Finding[], meta: {
    repo?: string;
    branch?: string;
    commit?: string;
    scanPath?: string;
}): string;
export declare function evaluateExitCode(findings: Finding[], failOnLevel: Severity | 'never'): void;
//# sourceMappingURL=index.d.ts.map