import * as core from '@actions/core';
import type { Finding, Severity } from './types/finding.js';
import type { AuditGuardConfig } from './types/config.js';
import { runEslintEngine } from './rules/eslint-engine.js';
import { runSemgrepEngine } from './rules/semgrep-engine.js';
import { runNpmAuditEngine } from './rules/npm-audit-engine.js';
import { deduplicateFindings } from './rules/deduplicator.js';
import { generateMarkdownReport } from './report/markdown-generator.js';

const SEVERITY_EXIT_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

function shouldFail(findings: Finding[], failOnLevel: Severity | 'never'): boolean {
  if (failOnLevel === 'never') return false;
  const threshold = SEVERITY_EXIT_ORDER.indexOf(failOnLevel);
  return findings.some(
    (f) => SEVERITY_EXIT_ORDER.indexOf(f.severity) <= threshold,
  );
}

export async function runAudit(config: AuditGuardConfig): Promise<Finding[]> {
  const allFindings: Finding[] = [];

  core.info('Starting ESLint security scan...');
  try {
    const eslintFindings = await runEslintEngine(
      config.scanPath,
      config.eslintConfigPath,
    );
    core.info(`ESLint: ${eslintFindings.length} findings`);
    allFindings.push(...eslintFindings);
  } catch (error) {
    core.warning(`ESLint scan failed: ${error}`);
  }

  core.info('Starting Semgrep scan...');
  try {
    const semgrepFindings = await runSemgrepEngine(
      config.scanPath,
      config.semgrepRulesets,
    );
    core.info(`Semgrep: ${semgrepFindings.length} findings`);
    allFindings.push(...semgrepFindings);
  } catch (error) {
    core.warning(`Semgrep scan failed: ${error}`);
  }

  core.info('Starting npm audit...');
  try {
    const npmFindings = await runNpmAuditEngine(config.scanPath);
    core.info(`npm audit: ${npmFindings.length} findings`);
    allFindings.push(...npmFindings);
  } catch (error) {
    core.warning(`npm audit failed: ${error}`);
  }

  const deduplicated = deduplicateFindings(allFindings);
  core.info(`After deduplication: ${deduplicated.length} findings`);

  return deduplicated;
}

export function generateReport(
  findings: Finding[],
  meta: { repo?: string; branch?: string; commit?: string; scanPath?: string },
): string {
  return generateMarkdownReport(findings, meta);
}

export function evaluateExitCode(
  findings: Finding[],
  failOnLevel: Severity | 'never',
): void {
  if (shouldFail(findings, failOnLevel)) {
    core.setFailed(
      `AuditGuard found findings at or above ${failOnLevel} severity.`,
    );
  }
}
