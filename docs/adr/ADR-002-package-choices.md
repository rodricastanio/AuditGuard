# ADR-002: Package Selection

## Status: Accepted

## Context

AuditGuard needs three capabilities: SAST (static analysis), secrets detection, and dependency auditing. We need to select specific packages for each.

## Decision

- **SAST generic**: `eslint-plugin-security` (14 rules) + core ESLint rules (`no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url`)
- **Secrets detection**: `eslint-plugin-no-secrets` (entropy-based + pattern matching)
- **Deep pattern analysis**: Semgrep with rulesets `p/default`, `p/security-audit`, `p/owasp-top-ten`
- **Dependency audit**: `npm audit` (built-in to npm CLI)

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| SonarQube | Requires a server; not suitable for per-push scanning |
| Snyk | Requires an API token and account |
| Custom ESLint rules | High maintenance cost; Semgrep already covers these patterns |
| Dependabot | Only handles dependencies, not code vulnerabilities |
| Socket.dev | Requires account; limited to dependency analysis |

## Rationale

- `eslint-plugin-security` is maintained under the `eslint-community` org with 2.4M weekly downloads
- Semgrep has 600+ pre-built rules and taint-tracking for 50+ Node.js libraries
- `npm audit` is zero-config and built into the npm CLI (ships with Node.js)
- All tools work without external accounts or API tokens

## Consequences

- Zero external dependencies for the end user (no tokens, no accounts)
- Semgrep requires Python (pip install), which is available on all GitHub-hosted runners
- npm audit only supports npm lockfiles (not yarn or pnpm)
