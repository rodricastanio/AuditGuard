import * as core from '@actions/core';
export function replaceSecrets(findings) {
    const secretFindings = findings.filter((f) => (f.rule === 'no-secrets/no-secrets' || f.rule === 'no-eval') &&
        f.file !== 'package.json');
    if (secretFindings.length === 0) {
        return false;
    }
    for (const finding of secretFindings) {
        core.warning(`Secret detected in ${finding.file}:${finding.line}.\n` +
            `  Rule: ${finding.rule}\n` +
            `  Message: ${finding.message}\n` +
            `  Manual action required: replace the hardcoded value with process.env.VARIABLE_NAME\n` +
            `  and add the variable to .env.example`);
    }
    return false;
}
//# sourceMappingURL=replace-secrets.js.map