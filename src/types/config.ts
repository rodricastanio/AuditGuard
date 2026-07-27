import type { Severity } from './finding.js';
import type { ReportLang } from '../report/markdown-generator.js';

export interface AuditGuardConfig {
  scanPath: string;
  failOnLevel: Severity | 'never';
  semgrepRulesets: string[];
  eslintConfigPath?: string;
  autoPrEnabled: boolean;
  dryRun: boolean;
  reportLang: ReportLang;
}

export const DEFAULT_CONFIG: AuditGuardConfig = {
  scanPath: '.',
  failOnLevel: 'critical',
  semgrepRulesets: ['p/default', 'p/security-audit', 'p/owasp-top-ten'],
  autoPrEnabled: true,
  dryRun: false,
  reportLang: 'en',
};

export const SEMGREP_VERSION = '1.170.1';
