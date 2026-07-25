import { execSync } from 'node:child_process';
import * as core from '@actions/core';
import { createAutoPr } from '../github/pull-request.js';
export async function runAutoPr(findings, token, dryRun) {
    const eligibleFindings = findings.filter((f) => f.autoFixEligible);
    if (eligibleFindings.length === 0) {
        core.info('No auto-fix-eligible findings found.');
        return;
    }
    core.info(`Found ${eligibleFindings.length} auto-fix-eligible findings`);
    const npmFindings = eligibleFindings.filter((f) => f.engine === 'npm-audit');
    const secretFindings = eligibleFindings.filter((f) => f.rule === 'no-secrets/no-secrets' || f.rule === 'no-eval');
    let changesApplied = false;
    if (npmFindings.length > 0) {
        changesApplied = applyNpmAuditFixes() || changesApplied;
    }
    if (secretFindings.length > 0) {
        changesApplied = applySecretFixes(secretFindings) || changesApplied;
    }
    if (!changesApplied) {
        core.info('No changes were applied.');
        return;
    }
    if (dryRun) {
        core.info('Dry run: skipping PR creation');
        return;
    }
    const body = generatePrBody(eligibleFindings);
    const today = new Date().toISOString().split('T')[0] || 'unknown';
    await createAutoPr('auditguard/auto-fix-' + today, `fix(security): automated remediation for ${eligibleFindings.length} findings`, body, token);
}
function applyNpmAuditFixes() {
    try {
        execSync('npm audit fix --force 2>&1 || true', { encoding: 'utf8' });
        return true;
    }
    catch {
        return false;
    }
}
function applySecretFixes(findings) {
    let changed = false;
    for (const finding of findings) {
        if (finding.file === 'package.json')
            continue;
        core.warning(`Secret found in ${finding.file}:${finding.line} — manual review recommended. ` +
            `Auto-replacement of secrets is disabled in v0.1.0.`);
    }
    return changed;
}
function generatePrBody(findings) {
    let body = '## AuditGuard Auto-Fix\n\n';
    body += 'This PR was automatically created by AuditGuard to fix low-risk security findings.\n\n';
    body += '### Changes Applied\n\n';
    const byEngine = new Map();
    for (const f of findings) {
        byEngine.set(f.engine, (byEngine.get(f.engine) || 0) + 1);
    }
    for (const [engine, count] of byEngine) {
        body += `- **${engine}**: ${count} finding(s) addressed\n`;
    }
    body += '\n### Findings Details\n\n';
    for (const f of findings) {
        body += `- \`${f.rule}\` in \`${f.file}:${f.line}\` (${f.severity})\n`;
    }
    body += '\n---\n';
    body += '> [!NOTE]\n';
    body += '> This PR only contains low-risk fixes. High-risk findings (SQL injection, XSS, etc.) ';
    body += '> remain in the security report and require manual remediation.\n';
    return body;
}
//# sourceMappingURL=auto-pr.js.map