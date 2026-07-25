# Architecture

## Overview

AuditGuard is a GitHub Action that performs automated security auditing on JavaScript/TypeScript repositories. It combines three analysis engines into a unified pipeline.

## Component Diagram

```
                    +------------------+
                    |   GitHub Action   |
                    |   (action.yml)    |
                    +--------+---------+
                             |
                    +--------v---------+
                    |    Orchestrator   |
                    |    (index.ts)     |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v-----+  +----v--------+
     | ESLint     |  | Semgrep    |  | npm audit   |
     | Engine     |  | Engine     |  | Engine      |
     | (16 rules) |  | (12 rules) |  | (CVE check) |
     +--------+---+  +------+-----+  +----+--------+
              |              |              |
              +--------------+--------------+
                             |
                    +--------v---------+
                    |   Deduplicator   |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Report Generator  |
                    | (Markdown)        |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v-----+  +----v--------+
     | PR Comment |  | Job        |  | Auto-PR     |
     | (sticky)   |  | Summary    |  | (fixes)     |
     +------------+  +------------+  +-------------+
```

## Data Flow

1. **Input**: User configures the action via `action.yml` inputs
2. **Scan**: Orchestrator runs all three engines in sequence
3. **Normalize**: Each engine maps its output to the `Finding` schema
4. **Deduplicate**: Remove overlapping findings (same rule, file, line)
5. **Filter**: Separate auto-fix-eligible findings from report-only findings
6. **Report**: Generate Markdown report
7. **Output**: Post PR comment, write job summary, optionally create auto-PR

## Key Design Decisions

- TypeScript for type safety and testability (ADR-001)
- Composite action for zero cold-start (ADR-007)
- Unified `Finding` schema across engines (ADR-003)
- Semgrep for complex patterns, ESLint for generic rules (ADR-004)
- npm audit for zero-config dependency scanning (ADR-005)
- Pinned tool versions for reproducibility (ADR-011)

## Security Considerations

- The action runs in the user's workflow with their `GITHUB_TOKEN`
- Permissions are minimal: `contents: write` + `pull-requests: write`
- No data is sent to external services (all analysis is local)
- Auto-PRs are created on a separate branch, not the main branch
