import type { Finding } from '../types/finding.js';

export function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Map<string, Finding>();

  for (const finding of findings) {
    const key = `${finding.rule}:${finding.file}:${finding.line}:${finding.column}`;

    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, finding);
      continue;
    }

    if (finding.engine === 'eslint' && existing.engine === 'semgrep') {
      seen.set(key, finding);
    } else if (finding.severity === 'critical' && existing.severity !== 'critical') {
      seen.set(key, finding);
    }
  }

  return Array.from(seen.values());
}
