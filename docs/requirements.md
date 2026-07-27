# Requirements

## Functional Requirements

### FR-01: Static Analysis (ESLint)
- Scan all `.js`, `.ts`, `.jsx`, `.tsx` files in the target path
- Apply 16 security rules from eslint-plugin-security and core ESLint
- Output findings in the unified `Finding` schema

### FR-02: Pattern Analysis (Semgrep)
- Scan all JS/TS files using Semgrep with configurable rulesets
- Default rulesets: `p/default`, `p/security-audit`, `p/owasp-top-ten`
- Detect: SQL injection, XSS, command injection, deserialization, CORS, prototype pollution, path traversal, insecure crypto
- Pin Semgrep version to `1.170.1`

### FR-03: Dependency Audit (npm audit)
- Run `npm audit --json` on the project
- Parse the JSON output (schema v2)
- Classify findings by severity and fix availability
- Determine auto-fix eligibility (non-breaking fixes only)

### FR-04: Report Generation
- Generate a Markdown report with:
  - Summary table (counts by severity)
  - Critical and high findings with file:line, CWE links, code evidence, suggestions
  - Medium and low findings in collapsible sections
  - npm audit results
  - Files scanned summary

### FR-05: PR Comment
- Post the report as a comment on the PR
- Update the existing comment on subsequent pushes (sticky comment)
- Support PR events and push events (look up associated PR)

### FR-06: Job Summary
- Write the report to `$GITHUB_STEP_SUMMARY`
- Use GitHub Flavored Markdown formatting

### FR-07: Auto-Fix PR
- Trigger only on push to `main`/`master` (not on PRs)
- Branch naming: `auditguard/auto-fix-YYYYMMDD-<short-sha>`
- Fix categories: npm audit fix (non-breaking), create missing files, replace simple secrets
- Create PR with descriptive body and `auditguard` label
- Never auto-apply high-risk fixes (SQL injection, XSS, etc.)

### FR-08: Configuration
- `scan-path`: Path to scan (default: `.`)
- `fail-on-level`: Minimum severity to fail CI (default: `critical`)
- `semgrep-rulesets`: Comma-separated rulesets (default: `p/default,p/security-audit,p/owasp-top-ten`)
- `eslint-config`: Custom ESLint config path (optional)
- `report-lang`: Report language `en` or `es` (default: `en`). Only translates template strings; CVE descriptions, rule names, CWE IDs remain in English.

### FR-09: Monorepo Support
- Support scanning a subdirectory via `scan-path` input
- Only scan files within the specified path

## Non-Functional Requirements

### NFR-01: Performance
- Full repo scan should complete in under 2 minutes for repos with <1000 files
- Composite action should have zero cold-start overhead

### NFR-02: Reproducibility
- Pinned tool versions ensure identical results across runs
- Semgrep pinned to `1.170.1`

### NFR-03: Testability
- Each rule has unit tests with fixtures
- Coverage threshold: 80%
- E2E validation against a real GitHub repo before release

### NFR-04: Compatibility
- Support Node.js 18+
- Support GitHub-hosted runners (ubuntu, macos, windows)
- Support GitHub Actions v2+ events

### NFR-05: Security
- No data sent to external services
- Minimal GITHUB_TOKEN permissions
- Auto-PRs on separate branches only
