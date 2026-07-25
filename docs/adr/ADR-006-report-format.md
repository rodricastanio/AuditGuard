# ADR-006: Report Format

## Status: Accepted

## Context

We need a report format that works as a GitHub PR comment, as a job summary, and as a downloadable artifact. It must be readable by humans and actionable.

## Decision

Use **Markdown** with structured tables, inline code blocks, and CWE links.

## Alternatives Considered

| Option | Reason Discarded |
|--------|-----------------|
| SARIF | Designed for tool interop; not human-readable without a viewer |
| JSON | Not readable in PR comments; requires external tooling |
| HTML | Heavy; not natively rendered in GitHub comments |
| Plain text | No formatting; tables are unreadable |

## Rationale

- GitHub renders Markdown natively in PR comments and job summaries
- Tables provide structured severity counts
- Inline code blocks show the vulnerable code with line numbers
- CWE links connect to the MITRE database for authoritative descriptions
- Collapsible sections (`<details>`) keep medium/low findings from overwhelming the report

## Consequences

- Report is limited to GitHub's Markdown rendering capabilities
- Large reports may hit the 1 MiB job summary limit (mitigated by collapsible sections)
- The same Markdown can be saved as a `.md` artifact for offline review
