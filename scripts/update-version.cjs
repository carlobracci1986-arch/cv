#!/usr/bin/env node

/**
 * Auto-update build version based on git commit count
 * This script runs before every build to update src/version.ts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Get git information
  let commitCount = '0';
  let commitHash = 'unknown';

  try {
    // Get total commit count (version number)
    commitCount = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
  } catch (e) {
    console.warn('⚠️  Could not get commit count, using default');
  }

  try {
    // Get short commit hash
    commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch (e) {
    console.warn('⚠️  Could not get commit hash, using default');
  }

  // Format version as v{commitCount}
  const version = `v${commitCount}`;

  // Read current version file
  const versionFilePath = path.join(__dirname, '../src/version.ts');

  // Generate new version content
  const newContent = `/**
 * Build Version (Auto-generated)
 * Updated automatically based on git commit count
 * Script: scripts/update-version.cjs
 */
export const BUILD_VERSION = '${version}';
export const BUILD_DATE = new Date().toLocaleDateString('it-IT');
export const BUILD_COMMIT = '${commitHash}';
export const BUILD_TIMESTAMP = '${new Date().toISOString()}';
`;

  // Write the file
  fs.writeFileSync(versionFilePath, newContent, 'utf-8');

  console.log(`✅ Version updated: ${version} (commit: ${commitHash})`);
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
