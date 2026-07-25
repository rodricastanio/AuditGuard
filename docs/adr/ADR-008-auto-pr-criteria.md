# ADR-008: Auto-PR Criteria

## Status: Accepted

## Context

AuditGuard can automatically create PRs to fix security issues. We need a clear policy for which fixes are safe to automate and which require human review.

## Decision

Auto-PR only for fixes that do not change application behavior and have no risk of breaking changes.

## In Scope (Auto-PR)

| Category | Action | Condition |
|----------|--------|-----------|
| CVE with non-breaking fix | `npm audit fix` | `fixAvailable.isSemVerMajor === false` |
| CVE with patch fix | `npm audit fix` | Patch version available |
| Missing `.gitignore` | Create with Node.js template | File does not exist |
| Missing `.env.example` | Create with detected variables | File does not exist |
| Simple hardcoded secrets | Replace with `process.env.VAR` + create `.env.example` | Literal API key/token/password |

## Out of Scope (Report Only)

| Category | Reason |
|----------|--------|
| SQL injection | Requires query architecture changes |
| XSS | Requires understanding render context |
| Command injection | Requires redesign of logic |
| Insecure deserialization | Requires evaluating alternatives |
| CORS misconfiguration | Requires understanding app policy |
| Prototype pollution | Requires algorithm changes |
| Path traversal | Requires contextual validation |
| Insecure crypto | Requires understanding threat model |
| Eval / code injection | Requires significant refactoring |
| Timing attacks | Requires logic changes |

## Rationale

- Low-risk fixes have deterministic outcomes (no human judgment needed)
- High-risk fixes require understanding the application's architecture and threat model
- Automating risky fixes could introduce new vulnerabilities

## Consequences

- Users get fast remediation for trivial issues
- Complex issues are clearly documented with fix suggestions
- The auto-PR is a separate PR, not mixed with feature changes
