# ADR-003: Finding Schema

## Status: Accepted

## Context

AuditGuard uses three different engines (ESLint, Semgrep, npm audit), each with its own output format. We need a unified schema to combine, deduplicate, filter, and report findings.

## Decision

Define a shared `Finding` TypeScript interface that all engines produce:

```typescript
interface Finding {
  id: string;
  engine: 'eslint' | 'semgrep' | 'npm-audit';
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  file: string;
  line: number;
  column: number;
  message: string;
  explanation: string;
  suggestion: string;
  cwe?: string;
  cweUrl?: string;
  fixAvailable: boolean;
  autoFixEligible: boolean;
  evidence?: string;
}
```

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| SARIF as internal format | Too verbose; designed for tool interop, not internal use |
| Per-engine formats | Makes deduplication and unified reporting difficult |
| JSON Schema only | No type safety at compile time |

## Rationale

- Unified schema simplifies deduplication (same rule from ESLint and Semgrep)
- TypeScript interface provides compile-time type checking
- `autoFixEligible` flag enables the auto-PR logic to filter without re-analyzing
- `cwe` and `cweUrl` enable linking to MITRE CWE database in reports

## Consequences

- Each engine wrapper must map its output to the `Finding` schema
- Report generator only needs to know one type
- Deduplication logic is straightforward (match on rule + file + line)
