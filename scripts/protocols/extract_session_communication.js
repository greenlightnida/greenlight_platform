#!/usr/bin/env node

/**
 * Session Communication Extractor
 *
 * Usage:
 *   node scripts/extract_session_communication.js --chat path/to/chat.log --terminal path/to/terminal.log --sessionId session-YYYY-MM-DD-HH-MM-SS
 *
 * Extracts errors and session notes from chat and terminal logs, and writes a summary JSON for the session communication log.
 */

import fs from 'fs';
import path from 'path';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const chatLogPath = args.chat;
const terminalLogPath = args.terminal;
const sessionId = args.sessionId;

if (!sessionId) {
  console.error('❌ Please provide --sessionId');
  process.exit(1);
}

const workSessionPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'work_sessions');
const outputPath = path.join(workSessionPath, `${sessionId}-comm-errors.json`);

function extractErrors(text) {
  const errorRegex = /(error|failed|not found|TypeError|ReferenceError|Exception|denied|unhandled|cannot|undefined|unexpected|invalid|crash|timeout|abort|permission)/i;
  return text.split('\n').filter(line => errorRegex.test(line));
}

function extractNotes(text) {
  const noteRegex = /(frustrat|confus|clarif|try again|protocol|decision|note:|important|fix|resolved|deviation|summary|blocked|stuck|please|let's|let us|let me|let you|let's try|let's see|let's fix|let's address|let's resolve)/i;
  return text.split('\n').filter(line => noteRegex.test(line));
}

function summarize(errors, notes) {
  if (errors.length === 0 && notes.length === 0) return 'No major communication errors or notes detected.';
  if (errors.length > 0 && notes.length === 0) return `Detected ${errors.length} error(s) during the session.`;
  if (notes.length > 0 && errors.length === 0) return `Detected ${notes.length} session note(s).`;
  return `Detected ${errors.length} error(s) and ${notes.length} session note(s).`;
}

let chatText = '';
let terminalText = '';

if (chatLogPath && fs.existsSync(chatLogPath)) {
  chatText = fs.readFileSync(chatLogPath, 'utf8');
}
if (terminalLogPath && fs.existsSync(terminalLogPath)) {
  terminalText = fs.readFileSync(terminalLogPath, 'utf8');
}

const allText = [chatText, terminalText].join('\n');
const errors = extractErrors(allText);
const notes = extractNotes(allText);
const summary = summarize(errors, notes);

const output = {
  errors,
  notes,
  summary
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`✅ Session communication log written to: ${outputPath}`); 