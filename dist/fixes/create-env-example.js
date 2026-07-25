import * as fs from 'node:fs';
import * as path from 'node:path';
export function createEnvExample(projectRoot, detectedSecrets) {
    const envExamplePath = path.join(projectRoot, '.env.example');
    if (fs.existsSync(envExamplePath)) {
        return false;
    }
    let content = '# Environment Variables\n';
    content += '# Copy this file to .env and fill in the values\n\n';
    if (detectedSecrets.length > 0) {
        content += '# Detected by AuditGuard:\n';
        for (const secret of detectedSecrets) {
            const envName = secret
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toUpperCase()
                .replace(/_+/g, '_');
            content += `${envName}=your_${envName.toLowerCase()}_here\n`;
        }
    }
    else {
        content += '# Add your environment variables here\n';
    }
    fs.writeFileSync(envExamplePath, content, 'utf8');
    return true;
}
//# sourceMappingURL=create-env-example.js.map