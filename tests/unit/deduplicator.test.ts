import { describe, it, expect } from 'vitest';
import { deduplicateFindings } from '../../src/rules/deduplicator';
import type { Finding } from '../../src/types/finding';

function makeFinding(overrides: Partial<Finding> = {}): Finding {
  return {
    id: 'test',
    engine: 'eslint',
    rule: 'no-eval',
    severity: 'critical',
    file: 'src/test.ts',
    line: 1,
    column: 1,
    message: 'test',
    explanation: 'test',
    suggestion: 'test',
    cwe: 'CWE-95',
    fixAvailable: false,
    autoFixEligible: false,
    ...overrides,
  };
}

describe('deduplicateFindings', () => {
  it('returns empty array for empty input', () => {
    expect(deduplicateFindings([])).toEqual([]);
  });

  it('keeps unique findings', () => {
    const findings = [
      makeFinding({ id: '1', rule: 'no-eval', file: 'a.ts', line: 1 }),
      makeFinding({ id: '2', rule: 'no-eval', file: 'b.ts', line: 2 }),
    ];
    expect(deduplicateFindings(findings)).toHaveLength(2);
  });

  it('deduplicates same rule on same file:line', () => {
    const findings = [
      makeFinding({ id: '1', engine: 'eslint', rule: 'no-eval', file: 'a.ts', line: 1 }),
      makeFinding({ id: '2', engine: 'semgrep', rule: 'no-eval', file: 'a.ts', line: 1 }),
    ];
    const result = deduplicateFindings(findings);
    expect(result).toHaveLength(1);
  });

  it('prefers eslint over semgrep for same location', () => {
    const findings = [
      makeFinding({ id: '1', engine: 'semgrep', rule: 'no-eval', file: 'a.ts', line: 1, severity: 'high' }),
      makeFinding({ id: '2', engine: 'eslint', rule: 'no-eval', file: 'a.ts', line: 1, severity: 'critical' }),
    ];
    const result = deduplicateFindings(findings);
    expect(result[0]!.engine).toBe('eslint');
  });

  it('keeps critical over non-critical for same key', () => {
    const findings = [
      makeFinding({ id: '1', engine: 'eslint', rule: 'no-eval', file: 'a.ts', line: 1, severity: 'medium' }),
      makeFinding({ id: '2', engine: 'eslint', rule: 'no-eval', file: 'a.ts', line: 1, severity: 'critical' }),
    ];
    const result = deduplicateFindings(findings);
    expect(result).toHaveLength(1);
    expect(result[0]!.severity).toBe('critical');
  });
});
