import type { Severity } from './finding.js';
export interface AuditGuardConfig {
    scanPath: string;
    failOnLevel: Severity | 'never';
    semgrepRulesets: string[];
    eslintConfigPath?: string;
    autoPrEnabled: boolean;
    dryRun: boolean;
}
export declare const DEFAULT_CONFIG: AuditGuardConfig;
export declare const SEMGREP_VERSION = "1.170.1";
//# sourceMappingURL=config.d.ts.map