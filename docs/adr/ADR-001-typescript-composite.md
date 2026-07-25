# ADR-001: TypeScript + Composite Action

## Status: Accepted

## Context

AuditGuard needs a runtime that supports complex logic (parsing, deduplication, report generation, PR creation) while running as a GitHub Action. We need to choose a language and an action type.

## Decision

Use **TypeScript** as the primary language and a **composite GitHub Action** as the packaging format.

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| Docker action | 10-60s cold start on every run; Linux only |
| JavaScript (no types) | No type safety; harder to maintain complex logic |
| Shell script | Limited for parsing, dedup, and report generation |
| Go binary | Requires compilation step; heavier than needed |

## Rationale

- TypeScript provides type safety, IDE support, and catches bugs at compile time
- Composite actions have zero cold-start overhead (no Docker image pull)
- Composite actions work on Linux, macOS, and Windows runners
- Each step is visible in the GitHub Actions UI for debugging
- npm and the Node.js runtime are pre-installed on all GitHub-hosted runners

## Consequences

- Requires a build step (`tsc`) before the action can run
- Must bundle or compile before publishing
- Gains type safety and testability over plain JavaScript
- Composite actions share the runner environment (no isolation), which is acceptable for a scan tool
