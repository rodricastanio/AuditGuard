import * as fs from 'node:fs';
import * as path from 'node:path';

const GITIGNORE_TEMPLATE = `# Dependencies
node_modules/

# Build output
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/
.nyc_output/

# Test
.vitest/
`;

export function createGitignore(projectRoot: string): boolean {
  const gitignorePath = path.join(projectRoot, '.gitignore');

  if (fs.existsSync(gitignorePath)) {
    return false;
  }

  fs.writeFileSync(gitignorePath, GITIGNORE_TEMPLATE, 'utf8');
  return true;
}
