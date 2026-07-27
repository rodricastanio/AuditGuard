# AuditGuard

Automated security auditor for JavaScript/TypeScript repositories.

AuditGuard is a GitHub Action that runs on every push and pull request to detect security vulnerabilities using static analysis (ESLint + Semgrep) and dependency auditing (npm audit). It generates a detailed Markdown report and can automatically create PRs for low-risk fixes.

## Features

- **Static analysis** via ESLint with security plugins (16 rules)
- **Pattern-based detection** via Semgrep (12 patterns: SQL injection, XSS, CORS, deserialization, etc.)
- **Dependency auditing** via npm audit (CVE detection with fix eligibility)
- **Markdown report** published as PR comment and job summary
- **Auto-fix PRs** for low-risk issues (dependency updates, missing files, simple secrets)

## Quick Start

```yaml
name: Security Audit
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

concurrency:
  group: auditguard-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: write
  pull-requests: write

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run AuditGuard
        uses: org/auditguard@v0.1.0
        with:
          scan-path: '.'
          fail-on-level: 'critical'
```

> **Important:** The `contents: write` and `pull-requests: write` permissions are required for the auto-PR and comment features. Without them, `auto-pr.ts` and `comment.ts` will fail with **403 Forbidden**. If you only need the report (no auto-PR), you can use `contents: read` and `pull-requests: write`.

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `scan-path` | Path to scan (repo root or subdirectory for monorepos) | `.` |
| `fail-on-level` | Minimum severity to fail CI (`never`, `low`, `moderate`, `high`, `critical`) | `critical` |
| `semgrep-rulesets` | Comma-separated Semgrep rulesets | `p/default,p/security-audit,p/owasp-top-ten` |
| `eslint-config` | Custom ESLint config path | (built-in security config) |
| `report-lang` | Report language (`en` or `es`) | `en` |

## Outputs

| Output | Description |
|--------|-------------|
| `total-findings` | Total number of findings |
| `critical-count` | Number of critical findings |
| `report-path` | Path to the generated Markdown report |

## How It Works

1. **ESLint scan** -- Runs security-focused ESLint rules on all JS/TS files
2. **Semgrep scan** -- Runs pattern-based security rules (SQL injection, XSS, etc.)
3. **npm audit** -- Checks for known CVEs in dependencies
4. **Report generation** -- Combines all findings into a Markdown report
5. **PR comment** -- Posts (or updates) the report as a comment on the PR
6. **Auto-PR** -- On push to main/master, creates a separate PR for low-risk fixes

## Auto-Fix PR Criteria

AuditGuard automatically creates a PR **only** for these low-risk fixes:

- **Dependency updates**: `npm audit fix` for CVEs with non-breaking fixes
- **Missing files**: `.gitignore` or `.env.example` that don't exist
- **Simple secrets**: Hardcoded API keys replaced with `process.env.VAR`

**Never auto-applied** (report only): SQL injection, XSS, command injection, CORS misconfiguration, deserialization, prototype pollution, path traversal, insecure crypto, eval usage.

## Known Limitations

### False Positives: `no-secrets` Entropy Detection (Rule E12)

The `no-secrets/no-secrets` rule uses entropy-based analysis to detect hardcoded secrets. This approach can produce **false positives** on:

- **UUIDs** (e.g., `const sessionId = "550e8400-e29b-41d4-a716-446655440000"`)
- **Hash values** (e.g., `const checksum = "a1b2c3d4e5f6..."`)
- **Base64-encoded config** (e.g., `const cert = "LS0tLS1CRUdJTi..."`)
- **Random tokens generated at build time** that are not actual secrets

**Mitigation:** Manually verify flagged values to confirm they are not real secrets. Automated suppression via `.auditguardignore` is planned for v0.2.0.

### Semgrep Version Dependency

AuditGuard pins Semgrep to version `1.170.1`. Custom Semgrep rules from the user's repo may require a different version. Overriding the pinned version is planned for v0.2.0 via a `semgrep-version` input.

### npm audit Only

Dependency auditing currently supports npm only. Yarn and pnpm lockfile support is planned for v0.2.0.

## Report Format

The report includes:

- Summary table (counts by severity)
- Critical and high findings with file:line, CWE links, code evidence, and fix suggestions
- Medium and low findings in collapsible sections
- npm audit results with CVE links and auto-fix eligibility
- Files scanned summary

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Validate fixtures
npm run validate-fixtures
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE)
