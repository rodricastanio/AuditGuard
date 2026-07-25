import * as core from '@actions/core';
import * as github from '@actions/github';
import { execSync } from 'node:child_process';
export async function createAutoPr(branchName, title, body, token) {
    const octokit = github.getOctokit(token);
    const { context } = github;
    const baseBranch = context.payload.repository?.default_branch || 'main';
    const shortSha = execSync('git rev-parse --short=7 HEAD', {
        encoding: 'utf8',
    }).trim();
    const fullBranchName = `${branchName}-${shortSha}`;
    try {
        execSync(`git checkout -b ${fullBranchName}`, { encoding: 'utf8' });
        execSync('git add -A', { encoding: 'utf8' });
        execSync(`git commit -m "fix: auditguard auto-remediation"`, {
            encoding: 'utf8',
        });
        execSync(`git push origin ${fullBranchName}`, { encoding: 'utf8' });
    }
    catch (error) {
        core.warning(`Failed to push branch: ${error}`);
        return { prUrl: null, created: false };
    }
    try {
        const existing = await octokit.rest.pulls.list({
            owner: context.repo.owner,
            repo: context.repo.repo,
            head: `${context.repo.owner}:${fullBranchName}`,
            base: baseBranch,
            state: 'open',
        });
        if (existing.data.length > 0) {
            core.info(`PR already exists: ${existing.data[0].html_url}`);
            return { prUrl: existing.data[0].html_url, created: false };
        }
        const result = await octokit.rest.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title,
            body,
            head: fullBranchName,
            base: baseBranch,
        });
        await octokit.rest.issues.addLabels({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: result.data.number,
            labels: ['auditguard', 'automated', 'security'],
        });
        core.info(`Created auto-fix PR: ${result.data.html_url}`);
        return { prUrl: result.data.html_url, created: true };
    }
    catch (error) {
        core.error(`Failed to create PR: ${error}`);
        return { prUrl: null, created: false };
    }
}
//# sourceMappingURL=pull-request.js.map