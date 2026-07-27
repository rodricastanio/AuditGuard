export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type Engine = 'eslint' | 'semgrep' | 'npm-audit';

export interface Finding {
  id: string;
  engine: Engine;
  rule: string;
  severity: Severity;
  file: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  explanation: string;
  suggestion: string;
  cwe?: string;
  cweUrl?: string;
  fixAvailable: boolean;
  autoFixEligible: boolean;
  evidence?: string;
}

export interface FindingSummary {
  total: number;
  bySeverity: Record<Severity, number>;
  byEngine: Record<Engine, number>;
  byFile: Record<string, number>;
}

export interface EngineFailure {
  engine: Engine;
  error: string;
}

export interface AuditResult {
  findings: Finding[];
  engineFailures: EngineFailure[];
}
