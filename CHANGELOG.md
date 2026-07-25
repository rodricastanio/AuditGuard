# Changelog

All notable changes to AuditGuard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0-alpha.1] - 2026-07-24

### Added

- Initial project structure and configuration
- ESLint security engine with 16 rules (eslint-plugin-security + eslint-plugin-no-secrets)
- Semgrep engine with 12 security patterns (pinned to v1.170.1)
- npm audit engine with CVE detection and fix eligibility
- Markdown report generator with severity tables, CWE links, and code evidence
- Deduplication of findings across engines
- GitHub Action (composite) with permissions and concurrency control
- PR comment posting (sticky updates)
- Job summary via GITHUB_STEP_SUMMARY
- Auto-fix PR creation for low-risk issues (dependencies, missing files, simple secrets)
- Branch naming: `auditguard/auto-fix-YYYYMMDD-<short-sha>`
- Configurable severity threshold for CI failure
- Monorepo support via `scan-path` input
- 30 test fixtures (16 ESLint + 12 Semgrep + 2 npm audit)
- Architecture documentation and 11 ADRs
