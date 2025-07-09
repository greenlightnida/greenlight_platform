#!/usr/bin/env ts-node

/**
 * File Management Scan Script
 * Scans for orphaned and duplicate files in src/ and frontend/src/
 * Outputs SYSTEM_AUDIT_REPORT.json and a human-readable summary
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Directories to scan
const SCAN_DIRS = ['src', 'frontend/src'];
const PROJECT_ROOT = process.cwd();
const IGNORE_FILE = '.filemanagementignore';
const OUTPUT_FILE = 'SYSTEM_AUDIT_REPORT.json';

// File patterns to exclude
const EXCLUDE_PATTERNS = [
  /\/index\.(ts|tsx)$/,
  /\/main\.(ts|tsx)$/,
  /__tests__\//,
  /\.test\.(ts|tsx)$/,
];

// Read ignore list
function readIgnoreList(): Set<string> {
  const ignorePath = path.join(PROJECT_ROOT, IGNORE_FILE);
  if (!fs.existsSync(ignorePath)) return new Set();
  const lines = fs.readFileSync(ignorePath, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  return new Set(lines);
}

// Recursively list all .ts/.tsx files in a directory
function listFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(listFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Check if a file matches any exclude pattern
function isExcluded(file: string, ignoreList: Set<string>): boolean {
  if (ignoreList.has(file)) return true;
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(file));
}

// Find all import/require statements in a file
function findReferences(file: string, allFiles: string[]): string[] {
  const content = fs.readFileSync(file, 'utf8');
  const refs: string[] = [];
  for (const otherFile of allFiles) {
    if (otherFile === file) continue;
    const otherContent = fs.readFileSync(otherFile, 'utf8');
    // Check for import or require of the file (by relative path, without extension)
    const relPath = './' + path.relative(path.dirname(otherFile), file).replace(/\\/g, '/').replace(/\.(ts|tsx)$/, '');
    const escapedPath = relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const importRegex = new RegExp(`(import|require)\\s*\\(?.*['"]${escapedPath}['"]`);
    if (importRegex.test(otherContent)) {
      refs.push(otherFile);
    }
  }
  return refs;
}

// Hash file content
function hashFile(file: string): string {
  const content = fs.readFileSync(file);
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Main scan
function main() {
  const ignoreList = readIgnoreList();
  let allFiles: string[] = [];
  for (const dir of SCAN_DIRS) {
    allFiles = allFiles.concat(listFiles(dir));
  }

  // Orphan detection
  const orphans: string[] = [];
  const referenced: Set<string> = new Set();
  for (const file of allFiles) {
    if (isExcluded(file, ignoreList)) continue;
    const refs = findReferences(file, allFiles);
    if (refs.length === 0) {
      orphans.push(file);
    } else {
      referenced.add(file);
    }
  }

  // Duplicate detection
  const hashMap: Record<string, string[]> = {};
  for (const file of allFiles) {
    const hash = hashFile(file);
    if (!hashMap[hash]) hashMap[hash] = [];
    hashMap[hash].push(file);
  }
  const duplicates = Object.values(hashMap).filter(files => files.length > 1);

  // Output report
  const report = {
    timestamp: new Date().toISOString(),
    scannedFiles: allFiles.length,
    orphans,
    duplicates,
    referenced: Array.from(referenced),
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

  // Human-readable summary
  console.log('--- File Management Scan Report ---');
  console.log(`Scanned files: ${allFiles.length}`);
  console.log(`Orphaned files: ${orphans.length}`);
  orphans.forEach(f => console.log('  ORPHAN:', f));
  console.log(`Duplicate file groups: ${duplicates.length}`);
  duplicates.forEach(group => {
    console.log('  DUPLICATES:');
    group.forEach(f => console.log('    ', f));
  });
  console.log('Report written to', OUTPUT_FILE);
}

main(); 