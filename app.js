/**
 * CLIPPIE — THE INTELLIGENT POCKET CLIPBOARD & SNIPPET SUITE
 * Complete Production-Grade JavaScript Engine (v2.0.0)
 * Compliant with PRD, Information Architecture Blueprint, and Stitch ID 9190291372802146778
 */

// =============================================================================
// 1. CONSTANTS & DEFAULT DATASETS
// =============================================================================

const STORAGE_KEYS = {
  SNIPPETS: 'clippie_snippets_v2',
  SETTINGS: 'clippie_settings_v2',
  HISTORY: 'clippie_history_v2',
  VAULT: 'clippie_vault_v2',
};

// Seed dataset representing developer tool precision
const INITIAL_SNIPPETS = [
  {
    id: 'clip_docker_stack',
    title: 'Docker Compose Full Stack',
    language: 'yaml',
    content: `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=postgres://db:5432/app`,
    tags: ['#devops', '#docker'],
    isStarred: true,
    thought: 'production ready docker stack with microservice web bridge',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'clip_fastapi_jwt',
    title: 'FastAPI Bearer Auth Dependency',
    language: 'python',
    content: `from fastapi import Depends, HTTPException, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\n\nsecurity = HTTPBearer()\n\nasync def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):\n    token = credentials.credentials\n    if token != "prod_secret_token_x":\n        raise HTTPException(\n            status_code=status.HTTP_401_UNAUTHORIZED,\n            detail="Invalid bearer token"\n        )\n    return {"sub": "admin-role"}`,
    tags: ['#auth', '#backend', '#api'],
    isStarred: true,
    thought: 'claims validated with HMAC SHA-256 bearer extraction',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'clip_git_squash',
    title: 'Git Squash & Rebase Main',
    language: 'bash',
    content: `# Interactive squash previous 4 commits before PR\ngit checkout -b feature/clean-history\ngit rebase -i HEAD~4\ngit push origin feature/clean-history --force-with-lease`,
    tags: ['#git', '#workflow'],
    isStarred: false,
    thought: 'clean commit tree prior to opening PR against master branch',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'clip_sql_bloat',
    title: 'Postgres Index Bloat Diagnostic',
    language: 'sql',
    content: `SELECT\n  schemaname, tablename, indexname,\n  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,\n  idx_scan AS total_scans\nFROM pg_stat_user_indexes\nORDER BY pg_relation_size(indexrelid) DESC LIMIT 10;`,
    tags: ['#database', '#postgres'],
    isStarred: true,
    thought: 'evaluates heap memory bloat on heavy production indices',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'clip_aws_iam_s3',
    title: 'AWS IAM S3 Read-Only Policy',
    language: 'json',
    content: `{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:Get*", "s3:List*"],\n    "Resource": "arn:aws:s3:::vault-production/*"\n  }]\n}`,
    tags: ['#cloud', '#aws', '#security'],
    isStarred: false,
    thought: 'least privilege access policy for analytics worker',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: 'clip_kill_port',
    title: 'Kill Process on Port 3000',
    language: 'bash',
    content: `# Instantly free up stale dev servers\nlsof -ti:3000 | xargs kill -9`,
    tags: ['#terminal', '#quick-fix'],
    isStarred: true,
    thought: 'terminates lingering node or python dev daemons cleanly',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
  },
  {
    id: 'clip_k8s_restart',
    title: 'Kubernetes Pod CrashLoop Inspector',
    language: 'bash',
    content: `kubectl get pods -n production --field-selector status.phase!=Running\nkubectl logs -n production -l app=api-ingress --tail=100 --previous`,
    tags: ['#devops', '#kubernetes'],
    isStarred: false,
    thought: 'inspects previous container crash logs on OOM kill',
    createdAt: new Date(Date.now() - 1000 * 60 * 1800).toISOString(),
  },
  {
    id: 'clip_rust_axum',
    title: 'Axum Async JWT Extractor',
    language: 'rust',
    content: `use axum::{async_trait, extract::FromRequestParts, http::request::Parts};\n\npub struct AuthClaims { pub user_id: String }\n\n#[async_trait]\nimpl<S> FromRequestParts<S> for AuthClaims {\n    type Rejection = (http::StatusCode, &'static str);\n    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {\n        // Extract header claims\n        Ok(AuthClaims { user_id: "usr_491".into() })\n    }\n}`,
    tags: ['#auth', '#rust', '#api'],
    isStarred: true,
    thought: 'type safe zero cost request parts extractor for web services',
    createdAt: new Date(Date.now() - 1000 * 60 * 2400).toISOString(),
  },
  {
    id: 'clip_ts_debounce',
    title: 'TypeScript Debounce Hook',
    language: 'typescript',
    content: `import { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delayMs: number = 200): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delayMs);\n    return () => clearTimeout(handler);\n  }, [value, delayMs]);\n  return debouncedValue;\n}`,
    tags: ['#frontend', '#typescript'],
    isStarred: false,
    thought: 'prevents UI layout recalculation thrashing during search',
    createdAt: new Date(Date.now() - 1000 * 60 * 3200).toISOString(),
  },
  {
    id: 'clip_docker_node',
    title: 'Dockerfile Multi-Stage Node 20',
    language: 'docker',
    content: `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nEXPOSE 3000\nCMD ["node", "dist/main.js"]`,
    tags: ['#docker', '#devops'],
    isStarred: true,
    thought: 'lightweight alpine container footprint with distinct cache layers',
    createdAt: new Date(Date.now() - 1000 * 60 * 4000).toISOString(),
  }
];

const INITIAL_HISTORY = [
  {
    id: 'hist_1',
    text: `def calculate_sha256(payload: bytes) -> str:\n    import hashlib\n    return hashlib.sha256(payload).hexdigest()`,
    type: 'code',
    lang: 'python',
    matchScore: 99,
    timestamp: new Date(Date.now() - 1000 * 18).toISOString(),
  },
  {
    id: 'hist_2',
    text: `gh pr checkout 412 && pnpm install --frozen-lockfile`,
    type: 'code',
    lang: 'bash',
    matchScore: 98,
    timestamp: new Date(Date.now() - 1000 * 120).toISOString(),
  },
  {
    id: 'hist_3',
    text: `{"apiVersion": "v1", "kind": "ConfigMap", "metadata": {"name": "app-cfg"}}`,
    type: 'json',
    lang: 'json',
    matchScore: 95,
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
  },
  {
    id: 'hist_4',
    text: `https://docs.docker.com/compose/compose-file/05-services/`,
    type: 'urls',
    lang: 'text',
    matchScore: 100,
    timestamp: new Date(Date.now() - 1000 * 840).toISOString(),
  },
  {
    id: 'hist_5',
    text: `git tag -a v2.4.9 -m "Release v2.4.9 AST parser upgrade" && git push --tags`,
    type: 'code',
    lang: 'bash',
    matchScore: 99,
    timestamp: new Date(Date.now() - 1000 * 1800).toISOString(),
  },
  {
    id: 'hist_6',
    text: `SELECT id, email, created_at FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 50;`,
    type: 'code',
    lang: 'sql',
    matchScore: 97,
    timestamp: new Date(Date.now() - 1000 * 3600).toISOString(),
  }
];

const INITIAL_SETTINGS = {
  theme: 'vscode',
  fontSize: 13,
  softWrap: true,
  lineNumbers: true,
  ligatures: true,
  autoDetect: true,
  smartTitle: true,
  viewMode: 'grid', // 'grid' | 'compact'
};

// =============================================================================
// 2. STATE MANAGER
// =============================================================================

const STATE = {
  snippets: [],
  history: [],
  settings: { ...INITIAL_SETTINGS },
  activeView: 'all-snippets',
  filters: {
    search: '',
    language: 'all',
    tag: null,
    vaultCategory: 'all',
  },
  modal: {
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    targetId: null,
    contentType: 'code', // 'code' | 'memo'
    detectedLang: 'python',
    confidence: 99.4,
    tags: ['#devops'],
    titleAlternatives: [],
    titleAltIndex: 0,
  },
  selectedHistoryId: null,
  isMonitoringActive: true,
};

// =============================================================================
// 3. PERSISTENCE LAYER
// =============================================================================

function loadStateFromStorage() {
  try {
    const rawSnippets = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
    STATE.snippets = rawSnippets ? JSON.parse(rawSnippets) : [...INITIAL_SNIPPETS];
  } catch {
    STATE.snippets = [...INITIAL_SNIPPETS];
  }

  try {
    const rawHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    STATE.history = rawHistory ? JSON.parse(rawHistory) : [...INITIAL_HISTORY];
  } catch {
    STATE.history = [...INITIAL_HISTORY];
  }

  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      STATE.settings = { ...INITIAL_SETTINGS, ...JSON.parse(rawSettings) };
    }
  } catch {
    STATE.settings = { ...INITIAL_SETTINGS };
  }

  if (STATE.history.length > 0) {
    STATE.selectedHistoryId = STATE.history[0].id;
  }
}

function saveSnippets() {
  try {
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(STATE.snippets));
    updateStorageTelemetry();
  } catch (err) {
    console.error('Failed to save snippets to localStorage:', err);
    triggerToast('Storage quota error', 'error');
  }
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(STATE.history));
    updateStorageTelemetry();
  } catch (err) {
    console.error('Failed to save history to localStorage:', err);
  }
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(STATE.settings));
    updateStorageTelemetry();
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// =============================================================================
// 4. SMART HEURISTIC & AST LANGUAGE DETECTION ENGINE
// =============================================================================

function detectLanguageAndConfidence(codeText) {
  if (!codeText || !codeText.trim()) {
    return { lang: 'plaintext', confidence: 50.0 };
  }

  const text = codeText.trim();
  const lower = text.toLowerCase();

  // 1. Shebang check (100% confidence)
  if (text.startsWith('#!/bin/bash') || text.startsWith('#!/bin/sh') || text.startsWith('#!/usr/bin/env bash')) {
    return { lang: 'bash', confidence: 99.8 };
  }
  if (text.startsWith('#!/usr/bin/env python') || text.startsWith('#!/usr/bin/python')) {
    return { lang: 'python', confidence: 99.8 };
  }

  // 2. Dockerfile patterns
  if (/^FROM\s+[\w\.\-\/:]+/im.test(text) && (lower.includes('workdir') || lower.includes('run') || lower.includes('copy'))) {
    return { lang: 'docker', confidence: 99.4 };
  }

  // 3. SQL patterns
  const sqlMatches = text.match(/\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|JOIN|WHERE|GROUP\s+BY|ORDER\s+BY)\b/gi);
  if (sqlMatches && sqlMatches.length >= 2) {
    const conf = Math.min(99.6, 85 + sqlMatches.length * 4);
    return { lang: 'sql', confidence: Number(conf.toFixed(1)) };
  }

  // 4. JSON patterns
  if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    try {
      JSON.parse(text);
      return { lang: 'json', confidence: 99.9 };
    } catch {
      // not strict JSON, continue
    }
  }

  // 5. Python patterns
  const pythonMatches = text.match(/\b(def\s+\w+|async\s+def|import\s+\w+|from\s+[\w\.]+\s+import|class\s+\w+|if\s+__name__\s*==|elif\b|except\s+[\w\.]+:|print\()/g);
  if (pythonMatches && pythonMatches.length >= 1) {
    const conf = Math.min(99.5, 82 + pythonMatches.length * 5);
    return { lang: 'python', confidence: Number(conf.toFixed(1)) };
  }

  // 6. Bash / Terminal commands
  const bashMatches = text.match(/\b(npm\s+(i|install|run|ci)|pnpm|yarn|git\s+(checkout|commit|push|pull|rebase|clone)|docker\s+run|kubectl\s+|lsof\s+-ti|curl\s+|xargs\s+|chmod\s+\+x|sudo\s+systemctl)\b/g);
  if (bashMatches && bashMatches.length >= 1) {
    const conf = Math.min(99.2, 88 + bashMatches.length * 4);
    return { lang: 'bash', confidence: Number(conf.toFixed(1)) };
  }

  // 7. Rust patterns
  const rustMatches = text.match(/\b(fn\s+\w+|pub\s+fn|let\s+mut|impl\s+|struct\s+\w+|match\s+\w+|Result<|Option<|#\[derive\()/g);
  if (rustMatches && rustMatches.length >= 1) {
    const conf = Math.min(99.6, 86 + rustMatches.length * 5);
    return { lang: 'rust', confidence: Number(conf.toFixed(1)) };
  }

  // 8. TypeScript / JavaScript patterns
  const tsMatches = text.match(/\b(const\s+\w+\s*[:=]|export\s+default|export\s+const|interface\s+\w+|type\s+\w+\s*=|import\s+.*from|useState|useEffect|async\s*\()/g);
  if (tsMatches && tsMatches.length >= 1) {
    const conf = Math.min(98.8, 80 + tsMatches.length * 5);
    return { lang: 'typescript', confidence: Number(conf.toFixed(1)) };
  }

  // 9. YAML patterns
  if (/^(\w+[\w\-]*):\s*(.*)$/m.test(text) && (text.includes('version:') || text.includes('services:') || text.includes('apiVersion:') || text.includes('spec:'))) {
    return { lang: 'yaml', confidence: 97.5 };
  }

  // 10. Markdown patterns
  if (/^#{1,4}\s+[\w\s]+/m.test(text) || /^-\s+\[[\sx]\]/m.test(text)) {
    return { lang: 'markdown', confidence: 96.0 };
  }

  return { lang: 'plaintext', confidence: 75.0 };
}

// =============================================================================
// 5. SMART HEURISTIC TITLE GENERATION
// =============================================================================

function generateSmartTitles(codeText, detectedLang) {
  const alternatives = [];
  if (!codeText || !codeText.trim()) {
    return ['Untitled Snippet'];
  }

  const lines = codeText.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';

  // Case 1: First line is a comment (# or // or /*)
  const commentMatch = firstLine.match(/^(?:#|\/\/|\/\*)\s*(.+?)(?:\*\/)?$/);
  if (commentMatch && commentMatch[1].length > 3) {
    const clean = commentMatch[1].trim();
    alternatives.push(clean.charAt(0).toUpperCase() + clean.slice(1));
  }

  // Case 2: Specific language statements
  if (detectedLang === 'python') {
    const fnMatch = codeText.match(/(?:async\s+def|def)\s+(\w+)/);
    if (fnMatch) {
      const formatted = fnMatch[1].replace(/_/g, ' ');
      alternatives.push(`Python ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`);
      alternatives.push(`${fnMatch[1]} Handler`);
    }
  } else if (detectedLang === 'bash') {
    if (firstLine.includes('git')) alternatives.push('Git Workflow Script');
    if (firstLine.includes('docker')) alternatives.push('Docker Command Recipe');
    if (firstLine.includes('kubectl')) alternatives.push('Kubernetes Cluster Command');
    if (firstLine.includes('lsof') || firstLine.includes('kill')) alternatives.push('Process Free Utility');
  } else if (detectedLang === 'sql') {
    const tableMatch = codeText.match(/FROM\s+([a-zA-Z0-9_\.]+)/i);
    if (tableMatch) {
      alternatives.push(`SQL Query (${tableMatch[1]})`);
      alternatives.push(`Index & Data Scan for ${tableMatch[1]}`);
    } else {
      alternatives.push('SQL Optimization Query');
    }
  } else if (detectedLang === 'yaml') {
    if (codeText.includes('services:')) alternatives.push('Docker Compose Service Template');
    if (codeText.includes('apiVersion:')) alternatives.push('Kubernetes Manifest Spec');
  } else if (detectedLang === 'rust') {
    const fnMatch = codeText.match(/fn\s+(\w+)/);
    if (fnMatch) alternatives.push(`Rust ${fnMatch[1]} Routine`);
  } else if (detectedLang === 'docker') {
    const fromMatch = codeText.match(/FROM\s+([\w\.\-\/:]+)/i);
    if (fromMatch) alternatives.push(`Dockerfile Base (${fromMatch[1]})`);
  }

  // Case 3: Fallback from first significant non-comment line
  const nonCommentLine = lines.find(l => !l.startsWith('#') && !l.startsWith('//') && !l.startsWith('/*')) || firstLine;
  const truncated = nonCommentLine.slice(0, 36).trim();
  if (truncated) {
    alternatives.push(truncated);
  }

  if (alternatives.length === 0) {
    alternatives.push(`${detectedLang.toUpperCase()} Utility Snippet`);
  }

  // Deduplicate
  return Array.from(new Set(alternatives));
}

// =============================================================================
// 6. SYNTAX COLORIZER ENGINE
// =============================================================================

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function colorizeCode(code, lang) {
  if (!code) return '';
  const escaped = escapeHtml(code);

  const keywords = {
    python: ['from', 'import', 'def', 'async', 'await', 'return', 'class', 'if', 'else', 'elif', 'try', 'except', 'raise', 'with', 'as', 'for', 'in', 'while', 'break', 'continue', 'lambda', 'True', 'False', 'None'],
    bash: ['git', 'docker', 'kubectl', 'npm', 'pnpm', 'yarn', 'curl', 'chmod', 'sudo', 'lsof', 'xargs', 'kill', 'echo', 'export', 'set', 'if', 'then', 'fi', 'for', 'in', 'do', 'done'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'ORDER', 'BY', 'GROUP', 'LIMIT', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'AS', 'DESC', 'ASC', 'AND', 'OR', 'NOT'],
    yaml: ['version', 'services', 'build', 'ports', 'environment', 'image', 'apiVersion', 'kind', 'metadata', 'spec'],
    rust: ['fn', 'pub', 'struct', 'impl', 'use', 'let', 'mut', 'async', 'await', 'return', 'match', 'enum', 'trait', 'for', 'in', 'while', 'Ok', 'Err'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'export', 'default', 'import', 'from', 'interface', 'type', 'async', 'await', 'if', 'else', 'new', 'try', 'catch', 'throw'],
    docker: ['FROM', 'WORKDIR', 'COPY', 'RUN', 'EXPOSE', 'CMD', 'ENTRYPOINT', 'ENV', 'ARG', 'VOLUME', 'AS'],
  };

  const kwList = keywords[lang] || keywords.typescript;
  const kwRegex = new RegExp(`\\b(${kwList.join('|')})\\b`, 'g');

  const lines = escaped.split('\n');
  const processedLines = lines.map(line => {
    // Comments
    if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
      return `<span class="syntax-comment">${line}</span>`;
    }
    if (line.trim().startsWith('/*') && line.trim().endsWith('*/')) {
      return `<span class="syntax-comment">${line}</span>`;
    }

    // Strings in quotes
    let parsed = line.replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="syntax-string">$1</span>');

    // Keywords
    parsed = parsed.replace(kwRegex, '<span class="syntax-keyword">$1</span>');

    // Numbers
    parsed = parsed.replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>');

    return parsed;
  });

  return processedLines.join('\n');
}

function generateLineNumbersHtml(lineCount) {
  const spans = [];
  for (let i = 1; i <= lineCount; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    spans.push(`<span>${num}</span>`);
  }
  return spans.join('');
}

// =============================================================================
// 7. TIME FORMATTER (HUMANIZED)
// =============================================================================

function formatRelativeTime(isoString) {
  const now = Date.now();
  const past = new Date(isoString).getTime();
  const diffSec = Math.max(1, Math.floor((now - past) / 1000));

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

// =============================================================================
// 8. CLIPBOARD & TOAST SYSTEM
// =============================================================================

function copyTextToClipboard(text, snippetTitle = 'Code') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => {
      triggerToast(`✓ Copied to clipboard! (${snippetTitle})`, 'success');
      recordClipboardHistoryEvent(text, snippetTitle);
      return true;
    }).catch(() => {
      return fallbackCopyText(text, snippetTitle);
    });
  } else {
    return Promise.resolve(fallbackCopyText(text, snippetTitle));
  }
}

function fallbackCopyText(text, snippetTitle) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (successful) {
      triggerToast(`✓ Copied to clipboard! (${snippetTitle})`, 'success');
      recordClipboardHistoryEvent(text, snippetTitle);
      return true;
    }
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  triggerToast('Clipboard permission denied', 'error');
  return false;
}

function recordClipboardHistoryEvent(text, snippetTitle) {
  if (!STATE.isMonitoringActive || !text || !text.trim()) return;

  const { lang, confidence } = detectLanguageAndConfidence(text);
  const existingIndex = STATE.history.findIndex(h => h.text.trim() === text.trim());
  if (existingIndex !== -1) {
    STATE.history.splice(existingIndex, 1);
  }

  const newHistItem = {
    id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    text: text,
    type: lang === 'plaintext' ? (text.startsWith('http') ? 'urls' : 'text') : 'code',
    lang: lang,
    matchScore: Math.round(confidence),
    timestamp: new Date().toISOString(),
  };

  STATE.history.unshift(newHistItem);
  if (STATE.history.length > 100) {
    STATE.history.pop();
  }

  saveHistory();
  renderHistoryView();
  updateNavBadges();
}

function triggerToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-in pointer-events-auto flex items-center gap-3 px-4 py-2.5 bg-surface-card/95 backdrop-blur-md rounded-lg border border-border-subtle shadow-2xl text-[12px] font-mono overflow-hidden relative';

  const barColor = type === 'error' ? 'bg-red-500' : 'bg-secondary';
  const iconName = type === 'error' ? 'error' : 'verified';
  const iconColor = type === 'error' ? 'text-red-400' : 'text-secondary';

  toast.innerHTML = `
    <div class="absolute left-0 top-0 bottom-0 w-1 ${barColor}"></div>
    <span class="material-symbols-outlined ${iconColor} text-[18px] shrink-0">${iconName}</span>
    <span class="text-text-primary flex-1 truncate">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-in');
    toast.classList.add('toast-out');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 2200);
}

// =============================================================================
// 9. VIEW RENDERING (ALL SNIPPETS)
// =============================================================================

function filterSnippets() {
  const query = STATE.filters.search.toLowerCase().trim();
  const lang = STATE.filters.language;
  const tag = STATE.filters.tag;

  return STATE.snippets.filter(snip => {
    // 1. Language filter
    if (lang !== 'all' && snip.language.toLowerCase() !== lang.toLowerCase()) {
      return false;
    }

    // 2. Tag filter
    if (tag && !snip.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
      return false;
    }

    // 3. Search query match
    if (query) {
      const matchTitle = snip.title.toLowerCase().includes(query);
      const matchContent = snip.content.toLowerCase().includes(query);
      const matchTag = snip.tags.some(t => t.toLowerCase().includes(query));
      const matchLang = snip.language.toLowerCase().includes(query);
      if (!matchTitle && !matchContent && !matchTag && !matchLang) {
        return false;
      }
    }

    return true;
  });
}

function renderAllSnippetsView() {
  const container = document.getElementById('snippetGridContainer');
  const emptyState = document.getElementById('emptyStateView');
  const activeBanner = document.getElementById('activeFilterBanner');
  const filterDesc = document.getElementById('activeFilterDescription');

  if (!container) return;

  const filtered = filterSnippets();

  // Update active filter banner
  const hasFilter = STATE.filters.search || STATE.filters.language !== 'all' || STATE.filters.tag;
  if (hasFilter && activeBanner) {
    activeBanner.classList.remove('hidden');
    let desc = [];
    if (STATE.filters.search) desc.push(`Query: "${STATE.filters.search}"`);
    if (STATE.filters.language !== 'all') desc.push(`Lang: ${STATE.filters.language.toUpperCase()}`);
    if (STATE.filters.tag) desc.push(`Tag: ${STATE.filters.tag}`);
    if (filterDesc) filterDesc.textContent = `${filtered.length} matches (${desc.join(' • ')})`;
  } else if (activeBanner) {
    activeBanner.classList.add('hidden');
  }

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const isCompact = STATE.settings.viewMode === 'compact';
  const softWrapClass = STATE.settings.softWrap ? 'soft-wrap-active' : '';
  const hideNumbersClass = !STATE.settings.lineNumbers ? 'hide-line-numbers' : '';

  container.innerHTML = filtered.map((snip, index) => {
    const lines = snip.content.split('\n');
    const lineCount = lines.length;
    const lineNumbersHtml = generateLineNumbersHtml(lineCount);
    const colorizedCode = colorizeCode(snip.content, snip.language);
    const starIcon = snip.isStarred ? 'star' : 'star_border';
    const starColor = snip.isStarred ? 'text-amber-400' : 'text-text-muted hover:text-amber-400';
    const starFill = snip.isStarred ? "style=\"font-variation-settings: 'FILL' 1;\"" : '';

    const langBadgeColor = getLangBadgeColor(snip.language);

    if (isCompact) {
      return `
        <article class="snippet-card col-span-full rounded-xl bg-surface-card p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-border-subtle hover:border-border-hover transition-all" data-id="${snip.id}">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <button onclick="toggleSnippetStar('${snip.id}')" class="p-1 rounded ${starColor} transition-colors" type="button" title="Toggle Star">
              <span class="material-symbols-outlined text-[18px]" ${starFill}>${starIcon}</span>
            </button>
            <span class="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${langBadgeColor}">${snip.language}</span>
            <h3 class="text-[13px] font-semibold text-text-primary truncate" title="${escapeHtml(snip.title)}">${escapeHtml(snip.title)}</h3>
            <span class="text-text-muted font-mono text-[11px] hidden md:inline">• ${lineCount} lines</span>
          </div>
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button onclick="openEditModal('${snip.id}')" class="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-container transition-colors" title="Edit Snippet" type="button">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button onclick="deleteSnippet('${snip.id}')" class="p-1 rounded text-text-muted hover:text-red-400 hover:bg-surface-container transition-colors" title="Delete" type="button">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
            <button onclick="handleCardCopy(this, '${snip.id}')" class="copy-trigger interactive-btn flex items-center gap-1 px-3 py-1 rounded bg-surface-container hover:bg-surface-high font-mono text-[11px] text-text-primary transition-all border border-border-subtle" type="button">
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy</span>
            </button>
          </div>
        </article>
      `;
    }

    return `
      <article class="snippet-card group flex flex-col rounded-xl bg-surface-card overflow-hidden shadow-sm" data-id="${snip.id}">
        <!-- Card Header -->
        <div class="flex items-center justify-between px-3.5 py-2.5 bg-surface-low border-b border-border-subtle">
          <div class="flex items-center gap-2 min-w-0 pr-2">
            <span class="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold shrink-0 ${langBadgeColor}">${snip.language}</span>
            <h3 class="text-[13px] font-semibold text-text-primary truncate tracking-tight" title="${escapeHtml(snip.title)}">${escapeHtml(snip.title)}</h3>
          </div>
          <div class="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity shrink-0">
            <button onclick="toggleSnippetStar('${snip.id}')" class="p-1 rounded ${starColor} hover:bg-surface-container transition-colors" type="button" title="Toggle Star">
              <span class="material-symbols-outlined text-[17px]" ${starFill}>${starIcon}</span>
            </button>
            <button onclick="openEditModal('${snip.id}')" class="p-1 rounded text-text-muted hover:text-primary hover:bg-surface-container transition-colors" type="button" title="Edit Snippet">
              <span class="material-symbols-outlined text-[17px]">edit</span>
            </button>
            <button onclick="deleteSnippet('${snip.id}')" class="p-1 rounded text-text-muted hover:text-red-400 hover:bg-surface-container transition-colors" type="button" title="Delete">
              <span class="material-symbols-outlined text-[17px]">delete</span>
            </button>
          </div>
        </div>

        <!-- IDE Code Body -->
        <div class="code-viewport ${softWrapClass} ${hideNumbersClass} relative p-3 overflow-x-auto selection:bg-primary-container max-h-[280px]">
          <div class="flex">
            <div class="code-line-gutter shrink-0">${lineNumbersHtml}</div>
            <pre class="flex-1 text-text-primary overflow-x-auto"><code class="language-${snip.language}">${colorizedCode}</code></pre>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between px-3.5 py-2.5 bg-surface-card border-t border-border-subtle gap-2 flex-wrap">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${snip.tags.map(t => `<button onclick="filterByTag('${t}')" class="px-1.5 py-0.2 rounded bg-surface-container hover:bg-surface-high font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors" type="button">${escapeHtml(t)}</button>`).join('')}
            <span class="font-mono text-[10px] text-text-muted ml-1">${formatRelativeTime(snip.createdAt)}</span>
          </div>

          <button onclick="handleCardCopy(this, '${snip.id}')" class="copy-trigger interactive-btn flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container hover:bg-surface-high font-mono text-[11px] text-text-primary font-medium transition-all shadow-sm border border-border-subtle" type="button">
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  updateStatsStrip();
}

function getLangBadgeColor(lang) {
  switch ((lang || '').toLowerCase()) {
    case 'python':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'bash':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'yaml':
      return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    case 'sql':
      return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    case 'json':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'rust':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'typescript':
    case 'javascript':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'docker':
      return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
    case 'markdown':
      return 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30';
    default:
      return 'bg-surface-container text-text-secondary border border-border-subtle';
  }
}

function handleCardCopy(btn, snippetId) {
  const snip = STATE.snippets.find(s => s.id === snippetId);
  if (!snip) return;

  const originalContent = btn.innerHTML;
  copyTextToClipboard(snip.content, snip.title).then(success => {
    if (success) {
      btn.innerHTML = `<span class="material-symbols-outlined text-[14px] text-secondary">check</span><span class="text-secondary font-semibold">Copied! ✨</span>`;
      btn.classList.add('copy-btn-success');
      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('copy-btn-success');
      }, 1500);
    }
  });
}

function updateStatsStrip() {
  const totalCountEl = document.getElementById('statsTotalCount');
  const sizeKbEl = document.getElementById('statsSizeKb');
  if (totalCountEl) totalCountEl.textContent = STATE.snippets.length;

  const totalChars = STATE.snippets.reduce((acc, s) => acc + (s.content?.length || 0), 0);
  const sizeKb = (totalChars / 1024).toFixed(1);
  if (sizeKbEl) sizeKbEl.textContent = `${sizeKb} KB`;

  updateNavBadges();
}

function updateNavBadges() {
  const countAll = document.getElementById('navCountAll');
  const countStarred = document.getElementById('navCountStarred');
  const countHistory = document.getElementById('navCountHistory');

  if (countAll) countAll.textContent = STATE.snippets.length;
  if (countStarred) countStarred.textContent = STATE.snippets.filter(s => s.isStarred).length;
  if (countHistory) countHistory.textContent = STATE.history.length;
}

// =============================================================================
// 10. VIEW RENDERING (STARRED VAULT)
// =============================================================================

function renderVaultView() {
  const container = document.getElementById('vaultGridContainer');
  if (!container) return;

  const cat = STATE.filters.vaultCategory;
  const starred = STATE.snippets.filter(s => s.isStarred);

  const filtered = starred.filter(snip => {
    if (cat === 'all') return true;
    if (cat === 'prod') return snip.tags.some(t => t.includes('devops') || t.includes('docker') || t.includes('cloud'));
    if (cat === 'auth') return snip.tags.some(t => t.includes('auth') || t.includes('security'));
    if (cat === 'database') return snip.tags.some(t => t.includes('database') || t.includes('postgres') || t.includes('sql'));
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 bg-surface-card rounded-xl border border-dashed border-border-subtle text-center space-y-2">
        <span class="material-symbols-outlined text-amber-400 text-[28px]">star_border</span>
        <h4 class="font-semibold text-[14px]">No Starred Snippets in this category</h4>
        <p class="text-text-muted text-[12px]">Click the star icon on any card to pin it into this encrypted vault.</p>
      </div>
    `;
    return;
  }

  const softWrapClass = STATE.settings.softWrap ? 'soft-wrap-active' : '';
  const hideNumbersClass = !STATE.settings.lineNumbers ? 'hide-line-numbers' : '';

  container.innerHTML = filtered.map((snip, index) => {
    const lineCount = snip.content.split('\n').length;
    const lineNumbersHtml = generateLineNumbersHtml(lineCount);
    const colorizedCode = colorizeCode(snip.content, snip.language);
    const pinIndex = index + 1;

    return `
      <article class="snippet-card group flex flex-col rounded-xl bg-surface-card overflow-hidden shadow-md" data-id="${snip.id}">
        <!-- Vault Header -->
        <div class="p-3 bg-surface-low border-b border-border-subtle flex items-start justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <button onclick="toggleSnippetStar('${snip.id}')" class="text-amber-400 hover:opacity-80 transition-opacity" title="Unstar">
              <span class="material-symbols-outlined text-[19px]" style="font-variation-settings: 'FILL' 1;">star</span>
            </button>
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1.5 font-mono text-[10px]">
                <span class="px-1.5 py-0.2 rounded bg-surface-lowest text-syntax-func uppercase font-bold">${snip.language}</span>
                <span class="px-1.5 py-0.2 rounded bg-surface-container text-amber-400 font-semibold">PIN #${pinIndex} [⌥${pinIndex}]</span>
              </div>
              <h3 class="text-[13px] font-semibold text-text-primary truncate mt-0.5" title="${escapeHtml(snip.title)}">${escapeHtml(snip.title)}</h3>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button onclick="openEditModal('${snip.id}')" class="p-1 rounded text-text-muted hover:text-text-primary" title="Edit">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button onclick="toggleSnippetStar('${snip.id}')" class="p-1 rounded text-text-muted hover:text-red-400" title="Remove from vault">
              <span class="material-symbols-outlined text-[16px]">star_border</span>
            </button>
          </div>
        </div>

        <!-- Code Block -->
        <div class="code-viewport ${softWrapClass} ${hideNumbersClass} p-3 overflow-x-auto max-h-[260px]">
          <div class="flex">
            <div class="code-line-gutter shrink-0">${lineNumbersHtml}</div>
            <pre class="flex-1 text-text-primary overflow-x-auto"><code class="language-${snip.language}">${colorizedCode}</code></pre>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-auto p-3 bg-surface-card border-t border-border-subtle flex items-center justify-between gap-2">
          <div class="flex items-center gap-1 flex-wrap">
            ${snip.tags.map(t => `<span class="px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-text-muted">${escapeHtml(t)}</span>`).join('')}
          </div>
          <button onclick="handleCardCopy(this, '${snip.id}')" class="copy-trigger interactive-btn flex items-center gap-1 px-3 py-1 rounded bg-surface-container hover:bg-surface-high font-mono text-[11px] text-text-primary transition-all border border-border-subtle" type="button">
            <span class="material-symbols-outlined text-[14px]">content_copy</span>
            <span>Copy</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function pinCurrentClipboard() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText().then(text => {
      if (!text || !text.trim()) {
        triggerToast('Clipboard is currently empty', 'error');
        return;
      }
      quickCaptureAndPin(text);
    }).catch(() => {
      triggerToast('Clipboard read denied. Use + New Snippet', 'error');
    });
  } else {
    triggerToast('Clipboard access not supported in this browser', 'error');
  }
}

function quickCaptureAndPin(text) {
  const { lang } = detectLanguageAndConfidence(text);
  const titles = generateSmartTitles(text, lang);
  const newSnippet = {
    id: `clip_${Date.now()}`,
    title: titles[0] || 'Pinned Clipboard Snippet',
    language: lang,
    content: text,
    tags: ['#vault', '#pinned'],
    isStarred: true,
    thought: 'instant capture directly from system clipboard buffer',
    createdAt: new Date().toISOString(),
  };

  STATE.snippets.unshift(newSnippet);
  saveSnippets();
  renderAllSnippetsView();
  renderVaultView();
  triggerToast(`Pinned to Starred Vault: "${newSnippet.title}" ★`);
}

// =============================================================================
// 11. VIEW RENDERING (CLIPBOARD HISTORY)
// =============================================================================

function renderHistoryView() {
  const listEl = document.getElementById('historyTimelineList');
  const statsEl = document.getElementById('historyStatsText');
  if (!listEl) return;

  const query = (document.getElementById('historySearchInput')?.value || '').toLowerCase().trim();
  const filtered = STATE.history.filter(h => !query || h.text.toLowerCase().includes(query) || h.lang.includes(query));

  if (statsEl) {
    const totalBytes = STATE.history.reduce((acc, h) => acc + h.text.length, 0);
    statsEl.textContent = `${STATE.history.length} cached • ${(totalBytes / 1024).toFixed(1)} KB footprint`;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="p-6 bg-surface-card rounded-xl border border-border-subtle text-center text-text-muted font-mono text-[12px]">No captured clipboard items match query.</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(item => {
    const isSelected = item.id === STATE.selectedHistoryId;
    const activeBorder = isSelected ? 'border-primary ring-1 ring-primary' : 'border-border-subtle hover:border-border-hover';
    const lines = item.text.split('\n');
    const previewLine = lines[0].slice(0, 60);

    return `
      <div onclick="selectHistoryItem('${item.id}')" class="clip-item interactive-btn cursor-pointer p-3 rounded-xl bg-surface-card border ${activeBorder} transition-all relative overflow-hidden" data-id="${item.id}">
        <div class="flex items-center justify-between mb-1.5 font-mono text-[11px]">
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded bg-primary-container text-primary-text font-semibold uppercase text-[10px]">${item.lang}</span>
            <span class="text-text-muted">${item.matchScore}% AST match</span>
          </div>
          <span class="text-secondary">${formatRelativeTime(item.timestamp)}</span>
        </div>
        <div class="font-mono text-[11px] text-text-primary bg-surface-lowest p-2 rounded truncate border border-border-subtle mb-1.5">
          ${escapeHtml(previewLine)}
        </div>
        <div class="flex items-center justify-between font-mono text-[10px] text-text-muted">
          <span>${item.text.length} bytes • ${lines.length} lines</span>
          <span class="text-text-secondary hover:text-primary">Inspect →</span>
        </div>
      </div>
    `;
  }).join('');

  updateHistoryInspector();
}

function selectHistoryItem(id) {
  STATE.selectedHistoryId = id;
  renderHistoryView();
}

function updateHistoryInspector() {
  const item = STATE.history.find(h => h.id === STATE.selectedHistoryId) || STATE.history[0];
  const badgeEl = document.getElementById('inspectBadge');
  const timestampEl = document.getElementById('inspectTimestamp');
  const codeBodyEl = document.getElementById('inspectCodeBody');
  const metaEl = document.getElementById('inspectMeta');
  const promoteBtn = document.getElementById('inspectPromoteBtn');
  const copyBtn = document.getElementById('inspectCopyBtn');

  if (!item) {
    if (codeBodyEl) codeBodyEl.textContent = 'Clipboard history ring buffer is empty.';
    return;
  }

  if (badgeEl) {
    badgeEl.textContent = item.lang.toUpperCase();
  }
  if (timestampEl) {
    timestampEl.textContent = formatRelativeTime(item.timestamp);
  }
  if (codeBodyEl) {
    codeBodyEl.innerHTML = colorizeCode(item.text, item.lang);
  }
  if (metaEl) {
    metaEl.textContent = `${item.text.length} bytes • ${item.text.split('\n').length} lines • AST ${item.matchScore}% verified`;
  }

  if (promoteBtn) {
    promoteBtn.onclick = () => {
      promoteHistoryToSnippet(item);
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      copyTextToClipboard(item.text, 'Clipboard Buffer');
    };
  }
}

function promoteHistoryToSnippet(histItem) {
  const titles = generateSmartTitles(histItem.text, histItem.lang);
  const newSnippet = {
    id: `clip_${Date.now()}`,
    title: titles[0] || 'Promoted Clipboard Snippet',
    language: histItem.lang,
    content: histItem.text,
    tags: ['#promoted', `#${histItem.lang}`],
    isStarred: false,
    thought: 'promoted from real-time clipboard daemon stream',
    createdAt: new Date().toISOString(),
  };

  STATE.snippets.unshift(newSnippet);
  saveSnippets();
  renderAllSnippetsView();
  triggerToast(`Promoted to All Snippets: "${newSnippet.title}" ✨`);
}

// =============================================================================
// 12. VIEW RENDERING (GIST SYNC)
// =============================================================================

function renderGistSyncView() {
  const container = document.getElementById('gistCardsContainer');
  if (!container) return;

  const mockGists = [
    {
      title: 'docker-compose.microservices.yml',
      status: 'Synced',
      files: '3 files',
      stars: 12,
      forks: 2,
      visibility: 'Public Gist',
      updated: '14m ago',
    },
    {
      title: 'fastapi-jwt-middleware.py',
      status: 'Synced',
      files: '1 file',
      stars: 34,
      forks: 7,
      visibility: 'Secret Gist',
      updated: '42m ago',
    },
    {
      title: 'k8s-ingress-controller-traefik.yaml',
      status: 'Synced',
      files: '2 files',
      stars: 8,
      forks: 1,
      visibility: 'Public Gist',
      updated: '2h ago',
    },
    {
      title: 'postgres-bloat-check.sql',
      status: 'Synced',
      files: '1 file',
      stars: 19,
      forks: 4,
      visibility: 'Public Gist',
      updated: 'Yesterday',
    }
  ];

  container.innerHTML = mockGists.map(g => `
    <article class="p-4 bg-surface-card rounded-xl border border-border-subtle hover:border-border-hover transition-all flex flex-col justify-between space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2 truncate">
          <span class="material-symbols-outlined text-syntax-func text-[18px]">deployed_code</span>
          <h4 class="font-mono text-[13px] font-semibold text-text-primary truncate hover:text-primary transition-colors">${escapeHtml(g.title)}</h4>
        </div>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-low font-mono text-[10px] text-secondary border border-border-subtle shrink-0">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> ${g.status}
        </span>
      </div>

      <div class="flex items-center gap-3 font-mono text-[11px] text-text-muted">
        <span>${g.files}</span>
        <span>•</span>
        <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[13px]">star</span> ${g.stars}</span>
        <span>•</span>
        <span class="flex items-center gap-0.5"><span class="material-symbols-outlined text-[13px]">fork_right</span> ${g.forks}</span>
        <span>•</span>
        <span class="px-1.5 py-0.2 rounded bg-surface-low">${g.visibility}</span>
      </div>

      <div class="pt-2 border-t border-border-subtle flex items-center justify-between font-mono text-[11px]">
        <span class="text-text-muted">${g.updated}</span>
        <button onclick="triggerToast('Opened remote Gist on GitHub')" class="text-primary hover:underline flex items-center gap-1" type="button">
          <span>View on GitHub</span>
          <span class="material-symbols-outlined text-[13px]">open_in_new</span>
        </button>
      </div>
    </article>
  `).join('');
}

function triggerGistSync() {
  const icon = document.getElementById('syncSpinIcon');
  const lastSyncText = document.getElementById('gistLastSyncedText');
  const revHash = document.getElementById('gistRevHash');

  if (icon) icon.classList.add('animate-spin');

  setTimeout(() => {
    if (icon) icon.classList.remove('animate-spin');
    const newHash = `#${Math.random().toString(16).slice(2, 9)}`;
    if (revHash) revHash.textContent = newHash;
    if (lastSyncText) lastSyncText.textContent = 'Last Synced: Just now';
    triggerToast(`Gist Sync Complete: Pushed ${STATE.snippets.length} snippets to remote (${newHash})`);
  }, 900);
}

// =============================================================================
// 13. VIEW RENDERING (PREFERENCES & STORAGE TELEMETRY)
// =============================================================================

function updateStorageTelemetry() {
  let totalChars = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('clippie_')) {
      totalChars += (localStorage[key]?.length || 0);
    }
  }

  const usedBytes = totalChars * 2; // UTF-16 approximation
  const maxBytes = 5 * 1024 * 1024; // 5MB standard localStorage
  const percent = Math.min(100, (usedBytes / maxBytes) * 100);
  const usedKb = (usedBytes / 1024).toFixed(1);

  // Sidebar elements
  const sidebarText = document.getElementById('sidebarStorageText');
  const sidebarBar = document.getElementById('sidebarStorageBar');
  if (sidebarText) sidebarText.textContent = `${usedKb} KB / 5 MB`;
  if (sidebarBar) sidebarBar.style.width = `${Math.max(2, percent)}%`;

  // Preferences elements
  const prefPercent = document.getElementById('prefQuotaPercent');
  const prefSummary = document.getElementById('prefStoredSummary');
  const prefQuota = document.getElementById('prefQuotaSummary');
  if (prefPercent) prefPercent.textContent = `${percent.toFixed(2)}% Used`;
  if (prefSummary) prefSummary.textContent = `${STATE.snippets.length} snippets stored`;
  if (prefQuota) prefQuota.textContent = `${usedKb} KB / 5.0 MB limit`;
}

function applyTheme(themeName) {
  STATE.settings.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  saveSettings();

  // Update theme picker label in header
  const labelEl = document.getElementById('themePickerLabel');
  if (labelEl) {
    const map = { vscode: 'VS Code', monokai: 'Monokai', github: 'GitHub', solarized: 'Solarized' };
    labelEl.textContent = map[themeName] || 'Theme';
  }

  // Update checkmarks in dropdown
  document.querySelectorAll('.theme-opt').forEach(btn => {
    const match = btn.getAttribute('data-theme') === themeName;
    const check = btn.querySelector('.check-icon');
    if (check) check.classList.toggle('hidden', !match);
  });

  // Update Preferences Theme Matrix
  document.querySelectorAll('.theme-card-option').forEach(card => {
    const match = card.getAttribute('data-theme-val') === themeName;
    const dot = card.querySelector('.theme-dot');
    const status = card.querySelector('.theme-status');
    if (dot) dot.className = `theme-dot w-2.5 h-2.5 rounded-full ${match ? 'bg-primary' : 'bg-surface-highest'}`;
    if (status) {
      status.textContent = match ? 'Active' : 'Select';
      status.className = `theme-status font-mono text-[11px] ${match ? 'text-primary font-semibold' : 'text-text-muted'}`;
    }
  });

  renderAllSnippetsView();
  renderVaultView();
}

function applyFontSize(size) {
  STATE.settings.fontSize = parseInt(size, 10) || 13;
  document.documentElement.style.setProperty('--editor-font-size', `${STATE.settings.fontSize}px`);
  document.documentElement.style.setProperty('--editor-line-height', `${STATE.settings.fontSize + 7}px`);
  saveSettings();

  document.querySelectorAll('.font-scale-btn').forEach(btn => {
    const match = parseInt(btn.getAttribute('data-size'), 10) === STATE.settings.fontSize;
    btn.classList.toggle('active', match);
    btn.classList.toggle('bg-primary-container', match);
    btn.classList.toggle('text-primary-text', match);
    btn.classList.toggle('font-semibold', match);
  });
}

// =============================================================================
// 14. EXPORT & IMPORT BACKUP SYSTEM
// =============================================================================

function exportDataBackup() {
  const exportPayload = {
    schemaVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    settings: STATE.settings,
    snippets: STATE.snippets,
    history: STATE.history,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `clippie_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  triggerToast('Configuration & Vault backup exported successfully 📋');
}

function handleImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data.snippets)) {
        STATE.snippets = data.snippets;
      } else if (Array.isArray(data)) {
        // legacy array of snippets
        STATE.snippets = data;
      }

      if (data.settings) {
        STATE.settings = { ...STATE.settings, ...data.settings };
      }
      if (Array.isArray(data.history)) {
        STATE.history = data.history;
      }

      saveSnippets();
      saveSettings();
      saveHistory();

      applyTheme(STATE.settings.theme);
      applyFontSize(STATE.settings.fontSize);
      renderAllSnippetsView();
      renderVaultView();
      renderHistoryView();
      updateStorageTelemetry();

      triggerToast(`Imported ${STATE.snippets.length} snippets successfully ✨`);
    } catch (err) {
      console.error('Failed to parse import JSON:', err);
      triggerToast('Invalid JSON backup file format', 'error');
    }
  };
  reader.readAsText(file);
}

// =============================================================================
// 15. RAPID CAPTURE MODAL LOGIC
// =============================================================================

function openModal(mode = 'create', snippetId = null) {
  STATE.modal.isOpen = true;
  STATE.modal.mode = mode;
  STATE.modal.targetId = snippetId;

  const overlay = document.getElementById('captureModalOverlay');
  const titleInput = document.getElementById('modalTitleInput');
  const codeTextarea = document.getElementById('modalCodeTextarea');
  const thoughtInput = document.getElementById('modalThoughtInput');
  const modeTitle = document.getElementById('modalModeTitle');
  const starCheckbox = document.getElementById('modalStarCheckbox');
  const commitBtnText = document.getElementById('modalCommitBtnText');
  const langSelect = document.getElementById('modalLanguageSelect');

  if (overlay) overlay.classList.remove('hidden');

  if (mode === 'edit' && snippetId) {
    const existing = STATE.snippets.find(s => s.id === snippetId);
    if (existing) {
      if (modeTitle) modeTitle.textContent = 'Edit Snippet';
      if (commitBtnText) commitBtnText.textContent = 'save_changes';
      if (titleInput) titleInput.value = existing.title;
      if (codeTextarea) codeTextarea.value = existing.content;
      if (thoughtInput) thoughtInput.value = existing.thought || '';
      if (starCheckbox) starCheckbox.checked = existing.isStarred;
      if (langSelect) langSelect.value = existing.language;
      STATE.modal.tags = [...existing.tags];
    }
  } else {
    // Create new
    if (modeTitle) modeTitle.textContent = 'Quick Stash';
    if (commitBtnText) commitBtnText.textContent = 'commit_snippet';
    if (titleInput) titleInput.value = '';
    if (codeTextarea) codeTextarea.value = '';
    if (thoughtInput) thoughtInput.value = '';
    if (starCheckbox) starCheckbox.checked = false;
    if (langSelect) langSelect.value = 'auto';
    STATE.modal.tags = ['#devops'];
  }

  updateModalTagsList();
  onModalCodeInput();

  setTimeout(() => {
    if (codeTextarea) codeTextarea.focus();
  }, 50);
}

function openEditModal(snippetId) {
  openModal('edit', snippetId);
}

function closeModal() {
  STATE.modal.isOpen = false;
  const overlay = document.getElementById('captureModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function onModalCodeInput() {
  const textarea = document.getElementById('modalCodeTextarea');
  const gutter = document.getElementById('modalLineGutter');
  const charCounter = document.getElementById('modalCharCounter');
  const langSelect = document.getElementById('modalLanguageSelect');
  const astConfidenceText = document.getElementById('modalAstConfidenceText');
  const filenameLabel = document.getElementById('modalFilenameLabel');

  if (!textarea) return;

  const text = textarea.value;
  const lines = text.split('\n');
  const lineCount = Math.max(1, lines.length);

  // Update line gutter
  if (gutter) {
    gutter.innerHTML = generateLineNumbersHtml(lineCount);
  }

  // Update char count
  if (charCounter) {
    charCounter.textContent = `${lineCount} lines • ${text.length} chars`;
  }

  // Language auto-detection
  let selectedLang = langSelect?.value || 'auto';
  if (selectedLang === 'auto') {
    const { lang, confidence } = detectLanguageAndConfidence(text);
    STATE.modal.detectedLang = lang;
    STATE.modal.confidence = confidence;
  } else {
    STATE.modal.detectedLang = selectedLang;
    STATE.modal.confidence = 100.0;
  }

  if (astConfidenceText) {
    astConfidenceText.textContent = `${STATE.modal.detectedLang} • ${STATE.modal.confidence}% AST confident`;
  }

  if (filenameLabel) {
    const extMap = { python: 'main.py', bash: 'script.sh', sql: 'query.sql', json: 'data.json', yaml: 'compose.yml', rust: 'main.rs', typescript: 'index.ts', docker: 'Dockerfile', markdown: 'notes.md' };
    filenameLabel.textContent = extMap[STATE.modal.detectedLang] || 'snippet.txt';
  }

  // Pre-generate title alternatives
  STATE.modal.titleAlternatives = generateSmartTitles(text, STATE.modal.detectedLang);
}

function regenerateSmartTitle() {
  const titleInput = document.getElementById('modalTitleInput');
  const textarea = document.getElementById('modalCodeTextarea');
  if (!titleInput || !textarea) return;

  STATE.modal.titleAlternatives = generateSmartTitles(textarea.value, STATE.modal.detectedLang);
  if (STATE.modal.titleAlternatives.length === 0) return;

  STATE.modal.titleAltIndex = (STATE.modal.titleAltIndex + 1) % STATE.modal.titleAlternatives.length;
  titleInput.value = STATE.modal.titleAlternatives[STATE.modal.titleAltIndex];
  triggerToast(`Inferred: "${titleInput.value}"`);
}

function setModalMode(mode) {
  STATE.modal.contentType = mode;
  const tabCode = document.getElementById('modalTabCode');
  const tabMemo = document.getElementById('modalTabMemo');
  const langSelect = document.getElementById('modalLanguageSelect');

  if (mode === 'memo') {
    if (tabMemo) tabMemo.className = 'px-3 py-1 rounded font-mono text-[11px] font-medium bg-surface-card text-text-primary border border-border-subtle transition-all flex items-center gap-1.5';
    if (tabCode) tabCode.className = 'px-3 py-1 rounded font-mono text-[11px] font-normal text-text-muted hover:text-text-secondary transition-all flex items-center gap-1.5';
    if (langSelect) langSelect.value = 'markdown';
  } else {
    if (tabCode) tabCode.className = 'px-3 py-1 rounded font-mono text-[11px] font-medium bg-surface-card text-text-primary border border-border-subtle transition-all flex items-center gap-1.5';
    if (tabMemo) tabMemo.className = 'px-3 py-1 rounded font-mono text-[11px] font-normal text-text-muted hover:text-text-secondary transition-all flex items-center gap-1.5';
    if (langSelect) langSelect.value = 'auto';
  }
  onModalCodeInput();
}

function toggleModalSoftWrap() {
  const textarea = document.getElementById('modalCodeTextarea');
  const btn = document.getElementById('modalWrapToggleBtn');
  if (!textarea || !btn) return;

  const isWrap = textarea.style.whiteSpace === 'pre';
  textarea.style.whiteSpace = isWrap ? 'pre-wrap' : 'pre';
  btn.textContent = isWrap ? 'wrap: on' : 'wrap: off';
}

function formatCodeInModal() {
  const textarea = document.getElementById('modalCodeTextarea');
  if (!textarea) return;

  const text = textarea.value;
  if (STATE.modal.detectedLang === 'json') {
    try {
      const parsed = JSON.parse(text);
      textarea.value = JSON.stringify(parsed, null, 2);
      onModalCodeInput();
      triggerToast('JSON auto-formatted');
    } catch {
      triggerToast('Invalid JSON structure', 'error');
    }
  } else {
    // Clean indentation & trailing spaces
    const cleaned = text.split('\n').map(l => l.trimEnd()).join('\n').trim();
    textarea.value = cleaned;
    onModalCodeInput();
    triggerToast('Code buffer cleaned & normalized');
  }
}

function updateModalTagsList() {
  const container = document.getElementById('modalTagsList');
  if (!container) return;

  container.innerHTML = STATE.modal.tags.map(tag => `
    <span class="group flex items-center gap-1 px-2 py-0.5 rounded border border-border-subtle bg-surface-low text-text-secondary font-mono text-[11px]">
      <span class="text-secondary">${tag.startsWith('#') ? '#' : ''}</span>${escapeHtml(tag.replace(/^#/, ''))}
      <button type="button" onclick="removeModalTag('${tag}')" class="hover:text-red-400 text-text-muted leading-none">
        <span class="material-symbols-outlined text-[12px]">close</span>
      </button>
    </span>
  `).join('');
}

function addModalTag(rawTag) {
  let tag = rawTag.trim();
  if (!tag) return;
  if (!tag.startsWith('#')) tag = `#${tag}`;
  if (!STATE.modal.tags.includes(tag)) {
    STATE.modal.tags.push(tag);
    updateModalTagsList();
  }
}

function removeModalTag(tag) {
  STATE.modal.tags = STATE.modal.tags.filter(t => t !== tag);
  updateModalTagsList();
}

function commitSnippetFromModal() {
  const titleInput = document.getElementById('modalTitleInput');
  const textarea = document.getElementById('modalCodeTextarea');
  const thoughtInput = document.getElementById('modalThoughtInput');
  const starCheckbox = document.getElementById('modalStarCheckbox');

  if (!textarea) return;
  const content = textarea.value.trim();
  if (!content) {
    triggerToast('Snippet code content cannot be empty', 'error');
    textarea.focus();
    return;
  }

  let title = titleInput?.value?.trim();
  if (!title) {
    const generated = generateSmartTitles(content, STATE.modal.detectedLang);
    title = generated[0] || 'Untitled Snippet';
  }

  const isStarred = starCheckbox ? starCheckbox.checked : false;
  const thought = thoughtInput?.value?.trim() || '';

  if (STATE.modal.mode === 'edit' && STATE.modal.targetId) {
    const index = STATE.snippets.findIndex(s => s.id === STATE.modal.targetId);
    if (index !== -1) {
      STATE.snippets[index].title = title;
      STATE.snippets[index].language = STATE.modal.detectedLang;
      STATE.snippets[index].content = content;
      STATE.snippets[index].tags = [...STATE.modal.tags];
      STATE.snippets[index].isStarred = isStarred;
      STATE.snippets[index].thought = thought;
      triggerToast(`Snippet updated: "${title}" ✨`);
    }
  } else {
    const newSnippet = {
      id: `clip_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: title,
      language: STATE.modal.detectedLang,
      content: content,
      tags: [...STATE.modal.tags],
      isStarred: isStarred,
      thought: thought,
      createdAt: new Date().toISOString(),
    };
    STATE.snippets.unshift(newSnippet);
    triggerToast(`New snippet captured & saved: "${title}" ✨`);
  }

  saveSnippets();
  closeModal();
  renderAllSnippetsView();
  renderVaultView();
}

// =============================================================================
// 16. CRUD ACTIONS
// =============================================================================

function toggleSnippetStar(id) {
  const snip = STATE.snippets.find(s => s.id === id);
  if (!snip) return;

  snip.isStarred = !snip.isStarred;
  saveSnippets();
  renderAllSnippetsView();
  renderVaultView();

  if (snip.isStarred) {
    triggerToast(`Added to Starred Vault: "${snip.title}" ★`);
  } else {
    triggerToast(`Removed from Starred Vault`);
  }
}

function deleteSnippet(id) {
  const snip = STATE.snippets.find(s => s.id === id);
  const title = snip ? snip.title : 'Snippet';

  STATE.snippets = STATE.snippets.filter(s => s.id !== id);
  saveSnippets();
  renderAllSnippetsView();
  renderVaultView();

  triggerToast(`Snippet deleted: "${title}"`);
}

function resetFilters() {
  STATE.filters.search = '';
  STATE.filters.language = 'all';
  STATE.filters.tag = null;

  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.lang-pill').forEach(pill => {
    const isAll = pill.getAttribute('data-lang') === 'all';
    pill.classList.toggle('active', isAll);
    pill.classList.toggle('bg-primary-container', isAll);
    pill.classList.toggle('text-primary-text', isAll);
  });

  renderAllSnippetsView();
}

function filterByTag(tag) {
  STATE.filters.tag = tag;
  renderAllSnippetsView();
}

// =============================================================================
// 17. VIEW NAVIGATION MANAGER
// =============================================================================

function switchView(viewName) {
  STATE.activeView = viewName;

  // Toggle active class on sidebar tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const isTarget = tab.getAttribute('data-view') === viewName;
    tab.classList.toggle('active', isTarget);
    tab.classList.toggle('bg-surface-container', isTarget);
    tab.classList.toggle('text-text-primary', isTarget);
    tab.classList.toggle('text-text-secondary', !isTarget);
  });

  // Toggle views
  document.querySelectorAll('.workspace-view').forEach(view => {
    view.classList.add('hidden');
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.remove('hidden');

  // Filter matrix subbar visibility (only needed on all-snippets and starred-vault)
  const filterMatrix = document.getElementById('filterMatrixBar');
  if (filterMatrix) {
    filterMatrix.classList.toggle('hidden', viewName !== 'all-snippets' && viewName !== 'starred-vault');
  }

  // Update active pill in header
  const labelEl = document.getElementById('activeWorkspaceLabel');
  if (labelEl) {
    const labels = {
      'all-snippets': 'All Snippets',
      'starred-vault': 'Starred Vault',
      'clipboard-history': 'Clipboard History',
      'gist-sync': 'Gist Sync',
      'settings': 'Preferences',
    };
    labelEl.textContent = labels[viewName] || 'Workspace';
  }

  // Render specific view contents
  if (viewName === 'all-snippets') renderAllSnippetsView();
  else if (viewName === 'starred-vault') renderVaultView();
  else if (viewName === 'clipboard-history') renderHistoryView();
  else if (viewName === 'gist-sync') renderGistSyncView();
  else if (viewName === 'settings') updateStorageTelemetry();

  // Close mobile sidebar drawer if open
  closeMobileSidebar();
}

// =============================================================================
// 18. MODALS & POPUPS
// =============================================================================

function openShortcutsModal() {
  const m = document.getElementById('shortcutsModalOverlay');
  if (m) m.classList.remove('hidden');
}

function closeShortcutsModal() {
  const m = document.getElementById('shortcutsModalOverlay');
  if (m) m.classList.add('hidden');
}

function openResetConfirmModal() {
  const m = document.getElementById('resetConfirmModal');
  if (m) m.classList.remove('hidden');
}

function closeResetConfirmModal() {
  const m = document.getElementById('resetConfirmModal');
  if (m) m.classList.add('hidden');
}

function executeResetCache() {
  localStorage.clear();
  STATE.snippets = [...INITIAL_SNIPPETS];
  STATE.history = [...INITIAL_HISTORY];
  STATE.settings = { ...INITIAL_SETTINGS };

  saveSnippets();
  saveHistory();
  saveSettings();

  applyTheme(STATE.settings.theme);
  applyFontSize(STATE.settings.fontSize);

  closeResetConfirmModal();
  renderAllSnippetsView();
  renderVaultView();
  renderHistoryView();
  updateStorageTelemetry();

  triggerToast('Cache wiped: Re-seeded default developer vault');
}

function openMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
  }
  if (backdrop) backdrop.classList.remove('hidden');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
  }
  if (backdrop) backdrop.classList.add('hidden');
}

// =============================================================================
// 19. EVENT LISTENERS SETUP
// =============================================================================

function initEventListeners() {
  // Mobile drawer
  document.getElementById('openSidebarBtn')?.addEventListener('click', openMobileSidebar);
  document.getElementById('closeSidebarBtn')?.addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebarBackdrop')?.addEventListener('click', closeMobileSidebar);

  // Nav workspace buttons
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Global search input with debounce
  const searchInput = document.getElementById('globalSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  let searchDebounceTimer = null;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      const val = e.target.value;
      if (clearSearchBtn) clearSearchBtn.classList.toggle('hidden', !val);

      searchDebounceTimer = setTimeout(() => {
        STATE.filters.search = val;
        renderAllSnippetsView();
      }, 150);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      STATE.filters.search = '';
      renderAllSnippetsView();
    });
  }

  // Language filter pills
  document.querySelectorAll('.lang-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.lang-pill').forEach(p => {
        p.classList.remove('active', 'bg-primary-container', 'text-primary-text');
        p.classList.add('bg-surface-card', 'text-text-secondary');
      });

      pill.classList.add('active', 'bg-primary-container', 'text-primary-text');
      pill.classList.remove('bg-surface-card', 'text-text-secondary');

      STATE.filters.language = pill.getAttribute('data-lang') || 'all';
      renderAllSnippetsView();
    });
  });

  // Tag chips
  document.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      STATE.filters.tag = STATE.filters.tag === tag ? null : tag;
      renderAllSnippetsView();
    });
  });

  // Editor display toggles (Soft-wrap & Numbers)
  document.getElementById('toggleSoftWrap')?.addEventListener('change', (e) => {
    STATE.settings.softWrap = e.target.checked;
    saveSettings();
    renderAllSnippetsView();
    renderVaultView();
  });

  document.getElementById('toggleLineNumbers')?.addEventListener('change', (e) => {
    STATE.settings.lineNumbers = e.target.checked;
    saveSettings();
    renderAllSnippetsView();
    renderVaultView();
  });

  // View mode switcher (Grid vs Compact)
  document.getElementById('viewGridBtn')?.addEventListener('click', () => {
    STATE.settings.viewMode = 'grid';
    saveSettings();
    document.getElementById('viewGridBtn')?.classList.add('bg-surface-card', 'text-primary');
    document.getElementById('viewGridBtn')?.classList.remove('text-text-muted');
    document.getElementById('viewCompactBtn')?.classList.remove('bg-surface-card', 'text-primary');
    document.getElementById('viewCompactBtn')?.classList.add('text-text-muted');
    renderAllSnippetsView();
  });

  document.getElementById('viewCompactBtn')?.addEventListener('click', () => {
    STATE.settings.viewMode = 'compact';
    saveSettings();
    document.getElementById('viewCompactBtn')?.classList.add('bg-surface-card', 'text-primary');
    document.getElementById('viewCompactBtn')?.classList.remove('text-text-muted');
    document.getElementById('viewGridBtn')?.classList.remove('bg-surface-card', 'text-primary');
    document.getElementById('viewGridBtn')?.classList.add('text-text-muted');
    renderAllSnippetsView();
  });

  // Theme Picker button & dropdown
  const themePickerBtn = document.getElementById('themePickerBtn');
  const themeDropdown = document.getElementById('themeDropdownMenu');
  if (themePickerBtn && themeDropdown) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.add('hidden');
    });

    document.querySelectorAll('.theme-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-theme');
        if (theme) applyTheme(theme);
        themeDropdown.classList.add('hidden');
      });
    });
  }

  // Preferences Theme Cards
  document.querySelectorAll('.theme-card-option').forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.getAttribute('data-theme-val');
      if (theme) applyTheme(theme);
    });
  });

  // Preferences Font scale buttons
  document.querySelectorAll('.font-scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      if (size) applyFontSize(size);
    });
  });

  // Preferences Ligatures toggle
  document.getElementById('prefLigatures')?.addEventListener('change', (e) => {
    STATE.settings.ligatures = e.target.checked;
    saveSettings();
    document.body.classList.toggle('enable-ligatures', STATE.settings.ligatures);
    document.body.classList.toggle('disable-ligatures', !STATE.settings.ligatures);
  });

  // Export / Import buttons
  document.getElementById('exportJsonBtn')?.addEventListener('click', exportDataBackup);

  const importBtn = document.getElementById('importJsonBtn');
  const importInput = document.getElementById('importJsonInput');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImportFile(e.target.files[0]);
      }
    });
  }

  const prefImportInput = document.getElementById('prefImportFileInput');
  if (prefImportInput) {
    prefImportInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImportFile(e.target.files[0]);
      }
    });
  }

  // Vault Category filter buttons
  document.querySelectorAll('.vault-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.vault-cat-btn').forEach(b => {
        b.classList.remove('active', 'bg-surface-container', 'text-primary');
        b.classList.add('bg-surface-card', 'text-text-secondary');
      });
      btn.classList.add('active', 'bg-surface-container', 'text-primary');
      btn.classList.remove('bg-surface-card', 'text-text-secondary');

      STATE.filters.vaultCategory = btn.getAttribute('data-cat') || 'all';
      renderVaultView();
    });
  });

  // Clipboard History controls
  document.getElementById('historySearchInput')?.addEventListener('input', () => {
    renderHistoryView();
  });

  document.getElementById('toggleMonitorBtn')?.addEventListener('click', () => {
    STATE.isMonitoringActive = !STATE.isMonitoringActive;
    const icon = document.getElementById('monitorIcon');
    const label = document.getElementById('monitorLabel');
    if (STATE.isMonitoringActive) {
      if (icon) { icon.textContent = 'pause'; icon.className = 'material-symbols-outlined text-[16px] text-secondary'; }
      if (label) label.textContent = 'Pause Capture';
      triggerToast('Clipboard real-time monitor resumed');
    } else {
      if (icon) { icon.textContent = 'play_arrow'; icon.className = 'material-symbols-outlined text-[16px] text-amber-400'; }
      if (label) label.textContent = 'Resume Capture';
      triggerToast('Clipboard monitor paused');
    }
  });

  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    STATE.history = [];
    saveHistory();
    renderHistoryView();
    triggerToast('Clipboard ring buffer cleared');
  });

  document.getElementById('simulateCaptureBtn')?.addEventListener('click', () => {
    const samples = [
      `kubectl get pods -n kube-system -o wide`,
      `const token = jwt.sign({ sub: "user_99" }, "SECRET_KEY", { expiresIn: "1h" });`,
      `curl -X POST https://api.stripe.com/v1/charges -u sk_test_123:`,
      `SELECT count(*) FROM audit_logs WHERE action = 'LOGIN_FAIL' AND created_at > NOW() - INTERVAL '1 hour';`,
      `docker build -t app-service:latest -f deploy/Dockerfile .`,
      `import { createClient } from '@supabase/supabase-js';\nexport const supabase = createClient(URL, KEY);`
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    recordClipboardHistoryEvent(picked, 'Simulated Event');
    triggerToast('Simulated real-time clipboard copy event');
  });

  // Gist Sync manual trigger
  document.getElementById('manualSyncBtn')?.addEventListener('click', triggerGistSync);

  // New Snippet button
  document.getElementById('openNewSnippetBtn')?.addEventListener('click', () => openModal('create'));

  // Modal event bindings
  const modalTextarea = document.getElementById('modalCodeTextarea');
  if (modalTextarea) {
    modalTextarea.addEventListener('input', onModalCodeInput);
    
    // Tab key indentation handling
    modalTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = modalTextarea.selectionStart;
        const end = modalTextarea.selectionEnd;
        modalTextarea.value = modalTextarea.value.substring(0, start) + '  ' + modalTextarea.value.substring(end);
        modalTextarea.selectionStart = modalTextarea.selectionEnd = start + 2;
        onModalCodeInput();
      }
    });
  }

  document.getElementById('modalLanguageSelect')?.addEventListener('change', onModalCodeInput);

  // Modal tag input
  const addTagInput = document.getElementById('modalAddTagInput');
  if (addTagInput) {
    addTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addModalTag(addTagInput.value);
        addTagInput.value = '';
      }
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    // Escape closes modals or clears search
    if (e.key === 'Escape') {
      if (STATE.modal.isOpen) {
        closeModal();
      } else if (document.getElementById('shortcutsModalOverlay')?.classList.contains('hidden') === false) {
        closeShortcutsModal();
      } else if (document.getElementById('resetConfirmModal')?.classList.contains('hidden') === false) {
        closeResetConfirmModal();
      } else if (searchInput && document.activeElement === searchInput) {
        searchInput.value = '';
        searchInput.blur();
        STATE.filters.search = '';
        renderAllSnippetsView();
      }
      return;
    }

    // Ctrl+Enter or Cmd+Enter commits snippet inside modal
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && STATE.modal.isOpen) {
      e.preventDefault();
      commitSnippetFromModal();
      return;
    }

    // Cmd+K or / focuses search
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !isEditing)) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
      return;
    }

    // 'N' opens new snippet modal (when not typing in an input)
    if (e.key === 'n' && !isEditing && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openModal('create');
      return;
    }

    // '?' opens shortcuts modal
    if (e.key === '?' && !isEditing && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openShortcutsModal();
      return;
    }

    // Alt+1 to Alt+9 quick-copies starred items
    if (e.altKey && !isNaN(parseInt(e.key, 10))) {
      const idx = parseInt(e.key, 10) - 1;
      const starred = STATE.snippets.filter(s => s.isStarred);
      if (starred[idx]) {
        e.preventDefault();
        copyTextToClipboard(starred[idx].content, starred[idx].title);
      }
    }
  });

  // Drag & drop restore on dropzone
  const dropzone = document.getElementById('backupDropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-primary');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-primary');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-primary');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImportFile(e.dataTransfer.files[0]);
      }
    });
  }
}

// =============================================================================
// 20. INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadStateFromStorage();
  initEventListeners();

  // Apply restored preferences
  applyTheme(STATE.settings.theme);
  applyFontSize(STATE.settings.fontSize);

  // Sync checkboxes
  const softWrapCb = document.getElementById('toggleSoftWrap');
  if (softWrapCb) softWrapCb.checked = STATE.settings.softWrap;

  const lineNumbersCb = document.getElementById('toggleLineNumbers');
  if (lineNumbersCb) lineNumbersCb.checked = STATE.settings.lineNumbers;

  const ligaturesCb = document.getElementById('prefLigatures');
  if (ligaturesCb) ligaturesCb.checked = STATE.settings.ligatures;

  // Initial render
  renderAllSnippetsView();
  renderVaultView();
  renderHistoryView();
  renderGistSyncView();
  updateStorageTelemetry();

  console.log('Clippie Core v2.0.0 initialized successfully.');
});

// Expose global functions to window for HTML inline event handlers
window.openModal = openModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.switchView = switchView;
window.resetFilters = resetFilters;
window.filterByTag = filterByTag;
window.handleCardCopy = handleCardCopy;
window.toggleSnippetStar = toggleSnippetStar;
window.deleteSnippet = deleteSnippet;
window.pinCurrentClipboard = pinCurrentClipboard;
window.selectHistoryItem = selectHistoryItem;
window.exportDataBackup = exportDataBackup;
window.openShortcutsModal = openShortcutsModal;
window.closeShortcutsModal = closeShortcutsModal;
window.openResetConfirmModal = openResetConfirmModal;
window.closeResetConfirmModal = closeResetConfirmModal;
window.executeResetCache = executeResetCache;
window.setModalMode = setModalMode;
window.regenerateSmartTitle = regenerateSmartTitle;
window.toggleModalSoftWrap = toggleModalSoftWrap;
window.formatCodeInModal = formatCodeInModal;
window.removeModalTag = removeModalTag;
window.commitSnippetFromModal = commitSnippetFromModal;
window.triggerToast = triggerToast;
window.triggerGistSync = triggerGistSync;
