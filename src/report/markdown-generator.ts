import type { Finding, Severity, FindingSummary, EngineFailure } from '../types/finding.js';

const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

const SEVERITY_EMOJI: Record<Severity, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
  info: '⚪',
};

function escapeMarkdown(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/#/g, '\\#')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    .replace(/\n/g, ' ');
}

function generateSummary(findings: Finding[]): FindingSummary {
  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  const byEngine: Record<string, number> = { eslint: 0, semgrep: 0, 'npm-audit': 0 };
  const byFile: Record<string, number> = {};

  for (const f of findings) {
    bySeverity[f.severity]++;
    byEngine[f.engine]++;
    byFile[f.file] = (byFile[f.file] || 0) + 1;
  }

  return {
    total: findings.length,
    bySeverity,
    byEngine: byEngine as Finding['engine'][] extends never ? Record<string, number> : Record<string, number>,
    byFile,
  };
}

function generateSummaryTable(findings: Finding[]): string {
  const summary = generateSummary(findings);

  let md = '| Severity | Count |\n';
  md += '|----------|-------|\n';
  for (const sev of SEVERITY_ORDER) {
    if (summary.bySeverity[sev] > 0) {
      md += `| ${SEVERITY_EMOJI[sev]} ${sev.toUpperCase()} | ${summary.bySeverity[sev]} |\n`;
    }
  }
  md += `| **Total** | **${summary.total}** |\n`;
  return md;
}

function generateFindingBlock(finding: Finding): string {
  let md = `### ${finding.id} — ${escapeMarkdown(finding.message)}\n\n`;
  md += '| Field | Value |\n';
  md += '|-------|-------|\n';
  md += `| **Severity** | ${SEVERITY_EMOJI[finding.severity]} ${finding.severity.toUpperCase()} |\n`;
  md += `| **File** | \`${finding.file}:${finding.line}\` |\n`;
  md += `| **Rule** | \`${finding.rule}\` |\n`;
  if (finding.cwe) {
    const link = finding.cweUrl ? `[${finding.cwe}](${finding.cweUrl})` : finding.cwe;
    md += `| **CWE** | ${link} |\n`;
  }
  md += `| **Engine** | ${finding.engine} |\n\n`;
  md += `**Explanation:** ${finding.explanation}\n\n`;
  md += `**Suggestion:** ${finding.suggestion}\n`;
  return md;
}

function generateNpmAuditTable(findings: Finding[]): string {
  const npmFindings = findings.filter((f) => f.engine === 'npm-audit');
  if (npmFindings.length === 0) return '';

  let md = '## npm audit\n\n';
  md += '| Package | Severity | CVE | Fix Available | Auto-fixable |\n';
  md += '|---------|----------|-----|---------------|--------------|\n';

  for (const f of npmFindings) {
    const pkg = f.rule.replace('npm-audit/', '');
    const cwe = f.cwe ? `[${f.cwe}](${f.cweUrl || '#'})` : 'N/A';
    md += `| ${pkg} | ${f.severity.toUpperCase()} | ${cwe} | ${f.fixAvailable ? 'Yes' : 'No'} | ${f.autoFixEligible ? 'Yes' : 'No'} |\n`;
  }

  return md;
}

function generateFilesScannedSummary(findings: Finding[], engineFailures: EngineFailure[]): string {
  const engines = ['eslint', 'semgrep', 'npm-audit'] as const;
  const failedEngines = new Set(engineFailures.map((f) => f.engine));

  let md = '## Files Scanned\n\n';
  md += '| Engine | Status | Findings |\n';
  md += '|--------|--------|----------|\n';

  for (const engine of engines) {
    const count = findings.filter((f) => f.engine === engine).length;
    const status = failedEngines.has(engine) ? 'FAILED' : 'OK';
    md += `| ${engine} | ${status} | ${count} |\n`;
  }

  return md;
}

export function generateMarkdownReport(
  findings: Finding[],
  meta: {
    repo?: string;
    branch?: string;
    commit?: string;
    scanPath?: string;
  } = {},
  engineFailures: EngineFailure[] = [],
): string {
  const summary = generateSummary(findings);

  let md = '# AuditGuard Security Report\n\n';

  if (engineFailures.length > 0) {
    md += '> [!WARNING]\n';
    for (const f of engineFailures) {
      md += `> **${f.engine}** failed to run: ${f.error}\n`;
    }
    md += '> Results below are incomplete. Investigate engine failures before relying on this report.\n\n';
  }

  if (meta.repo) md += `**Repo:** ${meta.repo}\n`;
  if (meta.branch) md += `**Branch:** ${meta.branch}\n`;
  if (meta.commit) md += `**Commit:** ${meta.commit}\n`;
  if (meta.scanPath) md += `**Scan path:** \`${meta.scanPath}\`\n`;
  md += `**Date:** ${new Date().toISOString()}\n`;
  md += '\n---\n\n';

  md += '## Summary\n\n';
  md += generateSummaryTable(findings);
  md += '\n';

  if (summary.total === 0 && engineFailures.length === 0) {
    md += '> [!NOTE]\n';
    md += '> No security vulnerabilities detected. All clear!\n\n';
  }

  if (summary.total === 0 && engineFailures.length > 0) {
    md += '> [!CAUTION]\n';
    md += '> **0 findings detected, but some engines failed.** Results are incomplete and cannot be trusted as clean.\n\n';
  }

  if (summary.bySeverity.critical > 0) {
    md += '> [!CAUTION]\n';
    md += `> **${summary.bySeverity.critical} CRITICAL finding(s) detected.** CI will fail until resolved.\n\n`;
  }

  const criticalFindings = findings.filter((f) => f.severity === 'critical');
  if (criticalFindings.length > 0) {
    md += '## Critical Findings\n\n';
    for (const f of criticalFindings) {
      md += generateFindingBlock(f) + '\n\n---\n\n';
    }
  }

  const highFindings = findings.filter((f) => f.severity === 'high');
  if (highFindings.length > 0) {
    md += '## High Findings\n\n';
    for (const f of highFindings) {
      md += generateFindingBlock(f) + '\n\n---\n\n';
    }
  }

  const mediumFindings = findings.filter((f) => f.severity === 'medium');
  if (mediumFindings.length > 0) {
    md += '<details>\n<summary>Medium Findings (' + mediumFindings.length + ')</summary>\n\n';
    for (const f of mediumFindings) {
      md += generateFindingBlock(f) + '\n\n';
    }
    md += '</details>\n\n';
  }

  const lowFindings = findings.filter((f) => f.severity === 'low' || f.severity === 'info');
  if (lowFindings.length > 0) {
    md += '<details>\n<summary>Low/Info Findings (' + lowFindings.length + ')</summary>\n\n';
    for (const f of lowFindings) {
      md += generateFindingBlock(f) + '\n\n';
    }
    md += '</details>\n\n';
  }

  const npmSection = generateNpmAuditTable(findings);
  if (npmSection) {
    md += '\n---\n\n' + npmSection;
  }

  md += '\n---\n\n';
  md += generateFilesScannedSummary(findings, engineFailures);

  md += '\n---\n\n';
  md += '*Generated by [AuditGuard](https://github.com/org/auditguard) v0.1.0*\n';

  return md;
}
