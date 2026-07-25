# ADR-004: Semgrep Over Custom ESLint Rules

## Status: Accepted

## Context

We need to detect complex vulnerability patterns like SQL injection, XSS, CORS misconfiguration, and insecure deserialization. These require understanding data flow (taint tracking) across function boundaries.

## Decision

Delegate complex pattern detection to **Semgrep** rather than writing custom ESLint rules.

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| Custom ESLint rules | No taint tracking; high maintenance; must reimplement what Semgrep already has |
| TypeScript compiler plugin | Too tightly coupled to TS; can't pattern-match across JS |
| AST-grep | Less mature ecosystem; fewer pre-built security rules |

## Rationale

- Semgrep has taint-tracking analysis built in for Express, Koa, NestJS, and 50+ libraries
- 600+ pre-built security rules maintained by the Semgrep team
- Rules are written in a pattern syntax that looks like source code (low learning curve)
- Semgrep supports both JS and TS natively

## Consequences

- Semgrep requires Python runtime (pip install) -- available on all GitHub-hosted runners
- Adds a second tool to maintain alongside ESLint
- Covers patterns that ESLint fundamentally cannot detect (data flow across files)
