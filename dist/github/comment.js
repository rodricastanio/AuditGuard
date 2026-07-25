import * as core from '@actions/core';
import * as github from '@actions/github';
export async function postPrComment(report, token) {
    const octokit = github.getOctokit(token);
    const { context } = github;
    const issueNumber = context.payload.pull_request?.number;
    if (!issueNumber) {
        core.warning('No PR number found; skipping comment post.');
        return;
    }
    const body = report;
    const marker = '<!-- auditguard-report -->';
    const fullBody = `${marker}\n${body}`;
    const { data: comments } = await octokit.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        per_page: 100,
    });
    const existing = comments.find((c) => c.body?.includes(marker));
    if (existing) {
        await octokit.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: existing.id,
            body: fullBody,
        });
        core.info(`Updated existing PR comment #${existing.id}`);
    }
    else {
        await octokit.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: issueNumber,
            body: fullBody,
        });
        core.info('Created new PR comment');
    }
}
//# sourceMappingURL=comment.js.map