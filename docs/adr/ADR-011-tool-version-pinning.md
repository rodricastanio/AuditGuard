# ADR-011: Tool Version Pinning

## Status: Accepted

## Context

AuditGuard depends on external tools (Semgrep, ESLint plugins, npm). An unexpected upgrade can change scan results, breaking reproducibility.

## Decision

Pin exact versions of external tools (Semgrep `1.170.1`, ESLint plugins to specific ranges).

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| Install `latest` | Not reproducible; upgrades can change results silently |
| Flexible ranges (`>=1.160`) | May install incompatible versions |
| Docker image with pinned versions | Adds cold-start overhead (see ADR-007) |

## Rationale

- Exact pinning ensures deterministic scan results across runs
- Prevents surprise breakage from upstream changes
- Makes debugging easier: same version = same behavior
- Upgrade process is explicit and tested

## Upgrade Process

1. Create a dedicated PR updating the pinned version
2. Run all fixtures against the new version
3. Only merge if all fixtures pass
4. Document the upgrade in `CHANGELOG.md`

## Consequences

- Requires periodic manual updates (monthly recommended)
- New security rules from upstream require explicit adoption
- The upgrade process is a gate for new releases
