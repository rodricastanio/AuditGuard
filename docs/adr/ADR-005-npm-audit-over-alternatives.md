# ADR-005: npm audit Over Alternatives

## Status: Accepted

## Context

We need to detect known CVEs in project dependencies. Multiple tools exist for this.

## Decision

Use **npm audit** (built into the npm CLI) as the dependency scanning engine.

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| Dependabot | Requires GitHub App installation; only creates PRs, no inline scanning |
| Snyk | Requires API token and account; rate-limited on free tier |
| Socket.dev | Requires account; focused on supply chain, not CVE detection |
| Trivy | Primarily for containers; overkill for npm dependencies |

## Rationale

- Zero configuration: runs with `npm audit --json` out of the box
- No external accounts or tokens required
- Ships with Node.js (npm is pre-installed on all runners)
- JSON output is parseable and well-structured (schema v2)
- `fixAvailable` field tells us exactly what can be auto-fixed

## Consequences

- Only supports npm lockfiles (not yarn.lock or pnpm-lock.yaml)
- npm audit may miss vulnerabilities not yet in the npm advisory database
- The JSON schema is not formally specified and may change between npm versions
