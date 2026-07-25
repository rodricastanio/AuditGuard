# Contributing to AuditGuard

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## Project Structure

- `src/` -- Main source code
  - `types/` -- TypeScript type definitions
  - `rules/` -- Engine wrappers (ESLint, Semgrep, npm audit)
  - `report/` -- Report generators (Markdown)
  - `fixes/` -- Auto-fix logic
  - `github/` -- GitHub API interactions (comments, PRs, summary)
- `action/` -- GitHub Action definition
- `tests/` -- Unit tests, integration tests, and fixtures
- `docs/` -- Architecture docs and ADRs
- `scripts/` -- Build and validation scripts

## Adding a New Rule

### ESLint Rules

1. Add the rule to the ESLint config in `src/rules/eslint-engine.ts`
2. Create a fixture in `tests/fixtures/eslint/<rule-name>/`
   - `vulnerable.js` or `vulnerable.ts` -- Code that triggers the rule
   - `safe.js` or `safe.ts` -- Equivalent safe code that should NOT trigger it
3. Add a unit test in `tests/unit/eslint-engine.test.ts`
4. Run `npm test` to verify

### Semgrep Patterns

1. Add the pattern ID to `src/rules/semgrep-engine.ts`
2. Create a fixture in `tests/fixtures/semgrep/<pattern-name>/`
3. Add a unit test in `tests/unit/semgrep-engine.test.ts`

## Code Style

- TypeScript strict mode
- Prettier for formatting (run `npm run format` before committing)
- ESLint for linting (run `npm run lint:fix` before committing)
- No comments in code unless explicitly requested
- Use descriptive variable/function names

## Testing

- Unit tests: `npm test`
- Coverage: `npm run test:coverage`
- Fixtures validation: `npm run validate-fixtures`

All tests must pass before merging. Coverage threshold is 80%.

## Commits

Use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `test:` adding tests
- `chore:` maintenance

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and lint
4. Open a PR with a clear description
5. Wait for CI to pass

## ADRs

When making significant architectural decisions, create an ADR in `docs/adr/` following the existing format.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
