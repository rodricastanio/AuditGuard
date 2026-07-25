# ADR-007: Composite vs Docker Action

## Status: Accepted

## Context

AuditGuard needs to run ESLint (Node.js), Semgrep (Python), and npm audit (npm CLI) as a GitHub Action. We must choose between composite and Docker action packaging.

## Decision

Use a **composite GitHub Action**.

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| Docker action | 10-60s cold start per run; Linux only; requires maintaining a Dockerfile |
| JavaScript action | Requires bundling with ncc; harder to install pip packages |

## Rationale

- Zero cold-start overhead (no Docker image pull)
- Works on Linux, macOS, and Windows runners
- Each tool's output is visible as a separate step in the GitHub Actions UI
- npm and pip are pre-installed on all GitHub-hosted runners
- Simpler maintenance: just YAML and shell scripts

## Consequences

- Shares the runner environment (no isolation between tools)
- Must install dependencies (npm packages, pip packages) on each run
- Cannot pin the exact OS or system library versions
