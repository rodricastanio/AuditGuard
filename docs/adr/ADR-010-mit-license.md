# ADR-010: MIT License

## Status: Accepted

## Context

AuditGuard needs a license that permits free use, community contributions, and adoption in corporate environments without significant restrictions.

## Decision

Use the **MIT License**.

## Alternatives Considered

| License | Reason Discarded |
|---------|-----------------|
| Apache 2.0 | More bureaucratic; includes patent clauses not needed for this project |
| GPL v3 | Restrictive for corporate use; prevents integration into proprietary products |
| BSD 3-Clause | Similar to MIT but less mainstream in developer tools |

## Rationale

- Maximum permissiveness: anyone can use, modify, and distribute
- Standard in open-source developer tools (ESLint, Prettier, Semgrep use MIT or equivalent)
- No restrictions on commercial use
- Allows forking without copyleft requirements
- Familiarity: most developers understand MIT without reading the full text

## Consequences

- Anyone can use, modify, and redistribute without significant restrictions
- Does not protect against use of the project name or branding
- Does not include patent warranty (acceptable for a scanning tool)
- Contributors must agree that their code is released under MIT
