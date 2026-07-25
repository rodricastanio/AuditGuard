import type { Severity } from './finding.js';

export interface AuditGuardConfig {
  scanPath: string;
  failOnLevel: Severity | 'never';
  semgrepRulesets: string[];
  eslintConfigPath?: string;
  autoPrEnabled: boolean;
  dryRun: boolean;
}

export const DEFAULT_CONFIG: AuditGuardConfig = {
  scanPath: '.',
  failOnLevel: 'critical',
  semgrepRulesets: ['p/default', 'p/security-audit', 'p/owasp-top-ten'],
  autoPrEnabled: true,
  dryRun: false,
};

export const SEMGREP_VERSION = '1.170.1';
