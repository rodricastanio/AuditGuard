# ADR-009: Versioning and Releases

## Status: Accepted

## Context

AuditGuard is a GitHub Action that users pin to specific versions. We need a predictable release strategy.

## Decision

Use **semantic versioning** with Git tags and an automated changelog.

## Rationale

- Semver communicates breaking changes clearly (major), new features (minor), and patches
- Users can pin to `v0.1.0` for stability or `v0.1` for latest patch
- GitHub Actions support pinning to tags, branch names, or commit SHAs

## Version Scheme

- `0.1.0-alpha.N` -- Pre-release milestones
- `0.1.0` -- First stable release
- `0.2.0` -- New features (yarn/pnpm support, .auditguardignore, semgrep-version input)
- `1.0.0` -- Production-ready with full test coverage

## Consequences

- Changelog is maintained manually in `CHANGELOG.md`
- Git tags are created for each release
- Users are encouraged to pin to full SHA for maximum security
