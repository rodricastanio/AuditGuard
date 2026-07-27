import { describe, it, expect } from 'vitest';
import { generateMarkdownReport } from '../../src/report/markdown-generator';
import type { Finding } from '../../src/types/finding';

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    id: 'eslint-no-eval-src/test.ts:1',
    engine: 'eslint',
    rule: 'no-eval',
    severity: 'critical',
    file: 'src/test.ts',
    line: 1,
    column: 1,
    message: 'eval() is prohibited',
    explanation: 'eval() executes arbitrary code.',
    suggestion: 'Use JSON.parse() instead.',
    cwe: 'CWE-95',
    cweUrl: 'https://cwe.mitre.org/data/definitions/95.html',
    fixAvailable: false,
    autoFixEligible: false,
    ...overrides,
  };
}

describe('generateMarkdownReport', () => {
  it('generates report with no findings', () => {
    const report = generateMarkdownReport([]);
    expect(report).toContain('# AuditGuard Security Report');
    expect(report).toContain('**Total** | **0**');
  });

  it('includes critical findings section', () => {
    const findings = [makeFinding({ severity: 'critical' })];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('## Critical Findings');
    expect(report).toContain('eval() is prohibited');
  });

  it('includes high findings section', () => {
    const findings = [makeFinding({ severity: 'high', id: 'test-high' })];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('## High Findings');
  });

  it('collapses medium findings', () => {
    const findings = [makeFinding({ severity: 'medium', id: 'test-medium' })];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('<details>');
    expect(report).toContain('Medium Findings');
  });

  it('includes CWE links', () => {
    const findings = [makeFinding()];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('CWE-95');
    expect(report).toContain('cwe.mitre.org');
  });

  it('includes npm audit table', () => {
    const findings = [
      makeFinding({
        engine: 'npm-audit',
        rule: 'npm-audit/lodash',
        severity: 'high',
        file: 'package.json',
        line: 0,
        column: 0,
        message: 'Command Injection in lodash',
        explanation: 'test',
        suggestion: 'test',
        fixAvailable: true,
        autoFixEligible: true,
      }),
    ];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('## npm audit');
    expect(report).toContain('lodash');
  });

  it('includes metadata when provided', () => {
    const report = generateMarkdownReport([], {
      repo: 'org/repo',
      branch: 'main',
      commit: 'abc1234',
      scanPath: 'src/',
    });
    expect(report).toContain('**Repo:** org/repo');
    expect(report).toContain('**Branch:** main');
    expect(report).toContain('**Commit:** abc1234');
    expect(report).toContain('**Scan path:** `src/`');
  });

  it('shows CAUTION alert for critical findings', () => {
    const findings = [makeFinding({ severity: 'critical' })];
    const report = generateMarkdownReport(findings);
    expect(report).toContain('[!CAUTION]');
    expect(report).toContain('1 CRITICAL finding');
  });

  it('generates Spanish report when lang=es', () => {
    const findings = [makeFinding({ severity: 'critical' })];
    const report = generateMarkdownReport(findings, {}, [], 'es');
    expect(report).toContain('# AuditGuard Informe de Seguridad');
    expect(report).toContain('## Resumen');
    expect(report).toContain('## Hallazgos Críticos');
    expect(report).toContain('**Explicación:**');
    expect(report).toContain('**Sugerencia:**');
    expect(report).toContain('**Severidad**');
    expect(report).toContain('**Archivo**');
    expect(report).toContain('**Regla**');
    expect(report).toContain('hallazgo(s) CRÍTICO(s) detectado(s)');
  });
});
