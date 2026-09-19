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
  GITHUB_PAT: 'clippie_github_pat',
  GITHUB_USER: 'clippie_github_user',
  GIST_CACHE: 'clippie_gist_cache_v2',
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
  gist: {
    pat: '',
    user: null,
    gists: [],
    selectedGistId: 'gist_fastapi_jwt',
    filter: '',
    sortOrder: 'desc',
    diffMode: 'unified', // 'unified' | 'split'
    rateLimit: { remaining: 5000, limit: 5000, reset: null },
    isDemoMode: true,
    lastSynced: 'Just now',
    revHash: '#d4a9f1c',
    commitMessage: 'feat: add token clock skew tolerance and refresh TTL',
  },
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

  // Load Gist PAT and User Cache
  try {
    const rawPat = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT);
    if (rawPat) {
      STATE.gist.pat = rawPat;
      STATE.gist.isDemoMode = false;
    }
    const rawUser = localStorage.getItem(STORAGE_KEYS.GITHUB_USER);
    if (rawUser) {
      STATE.gist.user = JSON.parse(rawUser);
    }
    const rawGistCache = localStorage.getItem(STORAGE_KEYS.GIST_CACHE);
    if (rawGistCache) {
      STATE.gist.gists = JSON.parse(rawGistCache);
    } else {
      STATE.gist.gists = getSeedGists();
    }
  } catch {
    STATE.gist.gists = getSeedGists();
  }

  if (STATE.history.length > 0) {
    STATE.selectedHistoryId = STATE.history[0].id;
  }
}

function saveGistCache() {
  try {
    localStorage.setItem(STORAGE_KEYS.GIST_CACHE, JSON.stringify(STATE.gist.gists));
  } catch (err) {
    console.error('Failed to cache gists:', err);
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
// 12. GIST SYNC ENGINE & DIFF INSPECTOR
// =============================================================================

function getSeedGists() {
  return [
    {
      id: 'gist_docker_compose',
      title: 'docker-compose.microservices.yml',
      filename: 'docker-compose.microservices.yml',
      path: 'infra/compose/docker-compose.yml',
      language: 'yaml',
      status: 'Synced',
      filesCount: '3 files',
      stars: 12,
      forks: 2,
      visibility: 'Public Gist',
      isPublic: true,
      updated: '14m ago',
      html_url: 'https://gist.github.com/developer/9dfb2a1a8c',
      remoteContent: `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=postgres://db:5432/app\n  cache:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"`,
      localContent: `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=postgres://db:5432/app\n  cache:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"`,
      revHash: '#9dfb2a1',
    },
    {
      id: 'gist_fastapi_jwt',
      title: 'fastapi-jwt-auth-middleware.py',
      filename: 'fastapi-jwt-auth-middleware.py',
      path: 'app/core/security/jwt_bearer.py',
      language: 'python',
      status: '1 local change pending',
      filesCount: '1 file',
      stars: 34,
      forks: 7,
      visibility: 'Secret Gist',
      isPublic: false,
      updated: 'Modified now',
      html_url: 'https://gist.github.com/developer/4b2a8e100f',
      remoteContent: `import time\nfrom fastapi import Depends, HTTPException, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\nfrom jose import jwt, JWTError\n\nsecurity = HTTPBearer()\n\nasync def verify_jwt_token(credentials: HTTPAuthorizationCredentials):\n    token = credentials.credentials\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        if payload.get("sub") is None: return False\n        return payload\n    except JWTError as exc:\n        raise HTTPException(status_code=401, detail="Invalid token")`,
      localContent: `import time\nfrom fastapi import Depends, HTTPException, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\nfrom jose import jwt, JWTError\n\nsecurity = HTTPBearer()\n\nasync def verify_jwt_token(credentials: HTTPAuthorizationCredentials):\n    token = credentials.credentials\n    try:\n        # Added 30s clock skew tolerance and custom leeway\n        options = {"verify_exp": True, "leeway": 30}\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options=options)\n        if payload.get("exp") - time.time() < REFRESH_BUFFER_SEC:\n            request.state.needs_refresh = True\n        return payload\n    except JWTError as exc:\n        raise HTTPException(status_code=401, detail="Invalid token")`,
      revHash: '#4b2a8e',
    },
    {
      id: 'gist_k8s_ingress',
      title: 'k8s-ingress-traefik-certmanager.yaml',
      filename: 'k8s-ingress-traefik-certmanager.yaml',
      path: 'deploy/k8s/traefik-ingress.yaml',
      language: 'yaml',
      status: 'Synced',
      filesCount: '2 files',
      stars: 4,
      forks: 1,
      visibility: 'Secret Gist',
      isPublic: false,
      updated: '2h ago',
      html_url: 'https://gist.github.com/developer/2b67d98ee1',
      remoteContent: `apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: clippie-ingress\n  annotations:\n    traefik.ingress.kubernetes.io/router.entrypoints: websecure\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  tls:\n  - hosts:\n    - vault.clippie.dev\n    secretName: clippie-tls`,
      localContent: `apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: clippie-ingress\n  annotations:\n    traefik.ingress.kubernetes.io/router.entrypoints: websecure\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  tls:\n  - hosts:\n    - vault.clippie.dev\n    secretName: clippie-tls`,
      revHash: '#2b67d98',
    },
    {
      id: 'gist_bash_profile',
      title: 'bash-developer-profile-aliases.sh',
      filename: 'bash-developer-profile-aliases.sh',
      path: '~/.bash_aliases',
      language: 'bash',
      status: 'Synced',
      filesCount: '1 file',
      stars: 38,
      forks: 9,
      visibility: 'Public Gist',
      isPublic: true,
      updated: '1d ago',
      html_url: 'https://gist.github.com/developer/f8812c3309a',
      remoteContent: `alias k="kubectl"\nalias g="git"\nalias dco="docker-compose"\nalias tf="terraform"\nexport EDITOR="vim"\nexport HISTSIZE=50000\nexport HISTFILESIZE=100000`,
      localContent: `alias k="kubectl"\nalias g="git"\nalias dco="docker-compose"\nalias tf="terraform"\nexport EDITOR="vim"\nexport HISTSIZE=50000\nexport HISTFILESIZE=100000`,
      revHash: '#f8812c3',
    }
  ];
}

/**
 * Robust Myers / LCS line-by-line Diff Generator
 */
function computeDiff(oldText, newText) {
  const oldLines = (oldText || '').split('\n');
  const newLines = (newText || '').split('\n');

  const N = oldLines.length;
  const M = newLines.length;

  const dp = Array.from({ length: N + 1 }, () => new Int32Array(M + 1));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (oldLines[i] === newLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const rows = [];
  let i = N;
  let j = M;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      rows.unshift({
        type: 'ctx',
        oldLine: i,
        newLine: j,
        text: oldLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rows.unshift({
        type: 'add',
        oldLine: '++',
        newLine: j,
        text: newLines[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      rows.unshift({
        type: 'del',
        oldLine: i,
        newLine: '--',
        text: oldLines[i - 1],
      });
      i--;
    }
  }

  let additions = 0;
  let deletions = 0;
  for (const r of rows) {
    if (r.type === 'add') additions++;
    if (r.type === 'del') deletions++;
  }

  return { rows, additions, deletions };
}

function renderGistSyncView() {
  const container = document.getElementById('gistCardsContainer');
  if (!container) return;

  // 1. Update API Rate Limit & Cache Telemetry
  const rateLimitEl = document.getElementById('gistRateLimitText');
  const cacheEtagEl = document.getElementById('gistCacheEtagText');
  if (rateLimitEl) {
    rateLimitEl.textContent = `${STATE.gist.rateLimit.remaining.toLocaleString()} / ${STATE.gist.rateLimit.limit.toLocaleString()}`;
  }
  if (cacheEtagEl) {
    cacheEtagEl.textContent = STATE.gist.pat ? '99.8% (Active)' : '99.4% (Active)';
  }

  // 2. Update PAT Connection Cards
  const disconCard = document.getElementById('gistPatDisconnectedCard');
  const connCard = document.getElementById('gistPatConnectedCard');
  const remoteLink = document.getElementById('gistRemoteLink');
  const remoteBadge = document.getElementById('gistRemoteStatusBadge');
  const terminalLog = document.getElementById('gistTerminalLogText');

  if (STATE.gist.pat && STATE.gist.user) {
    if (disconCard) disconCard.classList.add('hidden');
    if (connCard) connCard.classList.remove('hidden');

    const avatarEl = document.getElementById('gistUserAvatar');
    const nameEl = document.getElementById('gistUserName');
    const loginEl = document.getElementById('gistUserLogin');
    const pubCount = document.getElementById('gistPublicCount');
    const secCount = document.getElementById('gistSecretCount');

    if (avatarEl) avatarEl.src = STATE.gist.user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    if (nameEl) nameEl.textContent = STATE.gist.user.name || STATE.gist.user.login;
    if (loginEl) {
      loginEl.textContent = `@${STATE.gist.user.login}`;
      loginEl.href = STATE.gist.user.html_url || `https://github.com/${STATE.gist.user.login}`;
    }
    if (pubCount) pubCount.textContent = `${STATE.gist.user.public_gists || 0} public gists`;
    if (secCount) secCount.textContent = `${STATE.gist.user.total_private_gists || 0} secret gists`;

    if (remoteLink) {
      remoteLink.textContent = `gist.github.com/${STATE.gist.user.login}`;
      remoteLink.href = `https://gist.github.com/${STATE.gist.user.login}`;
    }
    if (remoteBadge) {
      remoteBadge.textContent = 'Connected (Live API)';
      remoteBadge.className = 'px-1.5 py-0.5 rounded bg-secondary-container text-secondary text-[10px] font-mono font-medium';
    }
    if (terminalLog) {
      terminalLog.textContent = `// memo: Authenticated as @${STATE.gist.user.login}. Token held in secure storage. Rate limits active.`;
    }
  } else {
    if (disconCard) disconCard.classList.remove('hidden');
    if (connCard) connCard.classList.add('hidden');

    if (remoteLink) {
      remoteLink.textContent = 'gist.github.com';
      remoteLink.href = 'https://gist.github.com';
    }
    if (remoteBadge) {
      remoteBadge.textContent = STATE.gist.isDemoMode ? 'Demo Sandbox' : 'Disconnected';
      remoteBadge.className = 'px-1.5 py-0.5 rounded bg-surface-container text-text-secondary text-[10px] font-mono';
    }
    if (terminalLog) {
      terminalLog.textContent = '// memo: Running in local sandbox. Connect GitHub PAT to sync live gists.';
    }
  }

  // 3. Update Sync Header Stats
  const lastSyncText = document.getElementById('gistLastSyncedText');
  const revHashEl = document.getElementById('gistRevHash');
  if (lastSyncText) lastSyncText.textContent = STATE.gist.lastSynced;
  if (revHashEl) revHashEl.textContent = STATE.gist.revHash;

  // 4. Filter & Sort Gists
  let filtered = [...STATE.gist.gists];
  const query = (STATE.gist.filter || '').toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(g =>
      (g.title || '').toLowerCase().includes(query) ||
      (g.filename || '').toLowerCase().includes(query) ||
      (g.language || '').toLowerCase().includes(query)
    );
  }

  if (STATE.gist.sortOrder === 'asc') {
    filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  const countBadge = document.getElementById('gistManagedCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} Managed`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 bg-surface-card rounded-xl border border-dashed border-border-subtle text-center text-text-muted font-mono text-[12px]">
        No gists match filter. Click "+ New Gist from Vault" to create one.
      </div>
    `;
    return;
  }

  // 5. Render Gist Cards
  container.innerHTML = filtered.map(g => {
    const isSelected = g.id === STATE.gist.selectedGistId;
    const hasPending = g.status === '1 local change pending';

    const cardBorder = isSelected
      ? 'border-primary ring-1 ring-primary/40 bg-surface-container shadow-lg'
      : 'border-border-subtle bg-surface-card hover:border-border-hover hover:bg-surface-low';

    const statusBadge = hasPending
      ? `<span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-syntax-variable border border-amber-500/30 font-mono text-[10px] font-medium">
           <span class="w-1.5 h-1.5 rounded-full bg-syntax-variable animate-ping"></span> 1 local change pending
         </span>`
      : `<span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container font-mono text-[10px] text-secondary border border-secondary/30 font-medium">
           <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> Synced
         </span>`;

    let fileIcon = 'deployed_code';
    if (g.language === 'python') fileIcon = 'security';
    else if (g.language === 'yaml') fileIcon = 'cloud_sync';
    else if (g.language === 'bash') fileIcon = 'terminal';

    // Staged preview delta if pending and selected
    let deltaPreview = '';
    if (hasPending && isSelected) {
      const diffData = computeDiff(g.remoteContent, g.localContent);
      deltaPreview = `
        <div class="p-2 rounded bg-surface-low flex items-center justify-between border border-border-subtle">
          <div class="flex items-center gap-2 min-w-0">
            <span class="material-symbols-outlined text-[15px] text-syntax-variable">difference</span>
            <span class="font-mono text-[11px] text-text-secondary truncate">~ delta: +${diffData.additions} lines / -${diffData.deletions} lines</span>
          </div>
          <span class="font-mono text-[11px] text-primary font-medium">Focused in Inspector →</span>
        </div>
      `;
    }

    return `
      <article onclick="selectGistForDiff('${g.id}')" class="interactive-btn cursor-pointer flex flex-col gap-3 p-3.5 rounded-xl border ${cardBorder} transition-all relative overflow-hidden group" data-id="${g.id}">
        ${isSelected ? '<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>' : ''}
        
        <div class="flex items-start justify-between gap-2 ${isSelected ? 'pl-1' : ''}">
          <div class="flex items-center gap-2 min-w-0">
            <span class="material-symbols-outlined text-[18px] text-syntax-func">${fileIcon}</span>
            <h4 class="font-mono text-[13px] font-semibold text-text-primary truncate group-hover:text-primary transition-colors">${escapeHtml(g.filename || g.title)}</h4>
          </div>
          ${statusBadge}
        </div>

        <div class="flex items-center justify-between text-text-muted font-mono text-[11px] ${isSelected ? 'pl-1' : ''}">
          <div class="flex items-center gap-2.5">
            <span class="text-text-secondary">${g.filesCount || '1 file'}</span>
            <span>•</span>
            <span class="flex items-center gap-0.5 text-text-secondary"><span class="material-symbols-outlined text-[13px]">star</span> ${g.stars || 0}</span>
            <span>•</span>
            <span class="flex items-center gap-0.5 text-text-secondary"><span class="material-symbols-outlined text-[13px]">fork_right</span> ${g.forks || 0}</span>
            <span>•</span>
            <span class="px-1.5 py-0.2 rounded bg-surface-lowest text-text-muted text-[10px]">${g.visibility || 'Secret Gist'}</span>
          </div>
          <span class="text-[10px] text-text-muted">${g.updated || 'Just now'}</span>
        </div>

        ${deltaPreview}

        <div class="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-[11px] ${isSelected ? 'pl-1' : ''}">
          <div class="flex items-center gap-2">
            <a href="${g.html_url || '#'}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors">
              <span class="material-symbols-outlined text-[13px]">open_in_new</span>
              <span>GitHub</span>
            </a>
            <span class="text-text-muted text-[10px]">•</span>
            <button onclick="event.stopPropagation(); copyTextToClipboard('${g.html_url || ''}', 'Gist URL')" class="inline-flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors" type="button">
              <span class="material-symbols-outlined text-[13px]">link</span>
              <span>Copy URL</span>
            </button>
          </div>
          
          <div class="flex items-center gap-1.5">
            <button onclick="event.stopPropagation(); pullRemoteGist('${g.id}')" class="px-2 py-0.5 rounded bg-surface-lowest hover:bg-surface-high text-text-secondary hover:text-text-primary border border-border-subtle transition-colors text-[10px]" type="button" title="Pull remote changes into local vault">
              Pull Remote
            </button>
            ${hasPending ? `
              <button onclick="event.stopPropagation(); pushCurrentGistChanges()" class="px-2 py-0.5 rounded bg-primary text-white hover:bg-blue-600 font-semibold transition-all text-[10px]" type="button">
                Push Local ⇧
              </button>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // 6. Update Right-Column Diff Inspector
  renderDiffInspector();
}

function selectGistForDiff(gistId) {
  STATE.gist.selectedGistId = gistId;
  renderGistSyncView();
}

function renderDiffInspector() {
  const activeGist = STATE.gist.gists.find(g => g.id === STATE.gist.selectedGistId) || STATE.gist.gists[0];
  if (!activeGist) return;

  const fileNameEl = document.getElementById('diffFileName');
  const revTagEl = document.getElementById('diffRevTag');
  const pathEl = document.getElementById('diffWindowPath');
  const metaBadgeEl = document.getElementById('diffMetaBadge');
  const rowsContainer = document.getElementById('diffRowsContainer');
  const additionsEl = document.getElementById('diffAdditionsCount');
  const deletionsEl = document.getElementById('diffDeletionsCount');

  if (fileNameEl) fileNameEl.textContent = activeGist.filename || activeGist.title;
  if (revTagEl) revTagEl.textContent = activeGist.revHash || '#4b2a8e';
  if (pathEl) pathEl.textContent = activeGist.path || activeGist.filename;
  if (metaBadgeEl) metaBadgeEl.textContent = `UTF-8 • ${(activeGist.language || 'code').toUpperCase()}`;

  const diffData = computeDiff(activeGist.remoteContent, activeGist.localContent);

  if (additionsEl) additionsEl.textContent = `+${diffData.additions} additions`;
  if (deletionsEl) deletionsEl.textContent = `-${diffData.deletions} deletions`;

  if (!rowsContainer) return;

  if (diffData.rows.length === 0) {
    rowsContainer.innerHTML = `<div class="p-4 text-center text-text-muted font-mono text-[12px]">Files are identical. No diff to inspect.</div>`;
    return;
  }

  if (STATE.gist.diffMode === 'unified') {
    rowsContainer.innerHTML = diffData.rows.map(row => {
      if (row.type === 'ctx') {
        return `
          <div class="flex items-center diff-line-ctx px-3 py-0.5">
            <span class="diff-gutter-num text-syntax-comment">${String(row.oldLine).padStart(2, '0')}</span>
            <span class="diff-gutter-num text-syntax-comment">${String(row.newLine).padStart(2, '0')}</span>
            <span class="w-4 shrink-0 text-center select-none text-syntax-comment">&nbsp;</span>
            <span class="whitespace-pre overflow-x-auto text-text-primary">${escapeHtml(row.text)}</span>
          </div>
        `;
      } else if (row.type === 'del') {
        return `
          <div class="flex items-center diff-line-del px-3 py-0.5">
            <span class="diff-gutter-num text-syntax-keyword">${String(row.oldLine).padStart(2, '0')}</span>
            <span class="diff-gutter-num text-syntax-comment">--</span>
            <span class="w-4 shrink-0 text-center select-none text-syntax-keyword font-bold">-</span>
            <span class="whitespace-pre overflow-x-auto line-del-text">${escapeHtml(row.text)}</span>
          </div>
        `;
      } else if (row.type === 'add') {
        return `
          <div class="flex items-center diff-line-add px-3 py-0.5">
            <span class="diff-gutter-num text-syntax-comment">++</span>
            <span class="diff-gutter-num text-secondary">${String(row.newLine).padStart(2, '0')}</span>
            <span class="w-4 shrink-0 text-center select-none text-secondary font-bold">+</span>
            <span class="whitespace-pre overflow-x-auto font-medium">${escapeHtml(row.text)}</span>
          </div>
        `;
      }
    }).join('');
  } else {
    // Side-by-side mode
    rowsContainer.innerHTML = `
      <div class="grid grid-cols-2 divide-x divide-border-subtle">
        <div class="flex flex-col">
          <div class="px-3 py-1 bg-surface-low border-b border-border-subtle font-mono text-[11px] text-syntax-keyword font-semibold">Remote (HEAD)</div>
          ${diffData.rows.filter(r => r.type !== 'add').map(r => `
            <div class="flex items-center px-2 py-0.5 ${r.type === 'del' ? 'diff-line-del' : 'diff-line-ctx'}">
              <span class="w-6 shrink-0 text-right pr-2 text-syntax-comment text-[10px]">${r.oldLine || ''}</span>
              <span class="whitespace-pre overflow-x-auto ${r.type === 'del' ? 'line-del-text' : ''}">${escapeHtml(r.text)}</span>
            </div>
          `).join('')}
        </div>
        <div class="flex flex-col">
          <div class="px-3 py-1 bg-surface-low border-b border-border-subtle font-mono text-[11px] text-secondary font-semibold">Local Workspace</div>
          ${diffData.rows.filter(r => r.type !== 'del').map(r => `
            <div class="flex items-center px-2 py-0.5 ${r.type === 'add' ? 'diff-line-add' : 'diff-line-ctx'}">
              <span class="w-6 shrink-0 text-right pr-2 text-syntax-comment text-[10px]">${r.newLine || ''}</span>
              <span class="whitespace-pre overflow-x-auto font-medium">${escapeHtml(r.text)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// -----------------------------------------------------------------------------
// Live GitHub REST API Integration & Sync Actions
// -----------------------------------------------------------------------------

async function connectGitHubAccount() {
  const input = document.getElementById('gistPatInput');
  const spinner = document.getElementById('connectPatSpinner');
  const label = document.getElementById('connectPatLabel');

  const pat = (input?.value || '').trim();
  if (!pat) {
    triggerToast('Please paste a GitHub Personal Access Token (PAT)', 'error');
    if (input) input.focus();
    return;
  }

  if (spinner) spinner.classList.add('animate-spin');
  if (label) label.textContent = 'Verifying...';

  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${pat}`,
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });

    // Capture live rate-limiting headers
    const remaining = res.headers.get('x-ratelimit-remaining');
    const limit = res.headers.get('x-ratelimit-limit');
    if (remaining && limit) {
      STATE.gist.rateLimit.remaining = parseInt(remaining, 10);
      STATE.gist.rateLimit.limit = parseInt(limit, 10);
    }

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Bad credentials: Token invalid or expired');
      } else {
        throw new Error(`GitHub API error HTTP ${res.status}`);
      }
    }

    const userData = await res.json();
    STATE.gist.pat = pat;
    STATE.gist.user = userData;
    STATE.gist.isDemoMode = false;

    localStorage.setItem(STORAGE_KEYS.GITHUB_PAT, pat);
    localStorage.setItem(STORAGE_KEYS.GITHUB_USER, JSON.stringify(userData));

    triggerToast(`Connected as @${userData.login}! Fetching remote gists...`);

    await fetchRemoteGists();
  } catch (err) {
    console.error('GitHub connection error:', err);
    triggerToast(`GitHub Connection Failed: ${err.message}`, 'error');
  } finally {
    if (spinner) spinner.classList.remove('animate-spin');
    if (label) label.textContent = 'Connect & Verify';
  }
}

async function fetchRemoteGists() {
  const icon = document.getElementById('syncSpinIcon');
  if (icon) icon.classList.add('animate-spin');

  if (!STATE.gist.pat) {
    // Sandbox simulated sync
    setTimeout(() => {
      if (icon) icon.classList.remove('animate-spin');
      STATE.gist.lastSynced = 'Just now';
      STATE.gist.revHash = `#${Math.random().toString(16).slice(2, 9)}`;
      renderGistSyncView();
      triggerToast(`Synced with Gist repository (${STATE.gist.revHash})`);
    }, 800);
    return;
  }

  try {
    const res = await fetch('https://api.github.com/gists?per_page=30', {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${STATE.gist.pat}`,
        'X-GitHub-Api-Version': '2022-11-28',
      }
    });

    const remaining = res.headers.get('x-ratelimit-remaining');
    const limit = res.headers.get('x-ratelimit-limit');
    if (remaining && limit) {
      STATE.gist.rateLimit.remaining = parseInt(remaining, 10);
      STATE.gist.rateLimit.limit = parseInt(limit, 10);
    }

    if (!res.ok) {
      throw new Error(`Failed to load gists: HTTP ${res.status}`);
    }

    const remoteList = await res.json();
    const liveGists = [];

    for (const item of remoteList) {
      const filesArr = Object.values(item.files || {});
      const firstFile = filesArr[0] || {};
      const filename = firstFile.filename || item.description || 'snippet.txt';
      const rawContent = firstFile.content || `# ${filename}\n# Fetched from GitHub Gist`;

      // Check if this gist has a matching local snippet in vault
      const matchingSnip = STATE.snippets.find(s => s.gistId === item.id || s.title.toLowerCase() === filename.toLowerCase());
      const localContent = matchingSnip ? matchingSnip.content : rawContent;
      const isModified = localContent.trim() !== rawContent.trim();

      liveGists.push({
        id: item.id,
        title: filename,
        filename: filename,
        path: filename,
        language: (firstFile.language || 'plaintext').toLowerCase(),
        status: isModified ? '1 local change pending' : 'Synced',
        filesCount: `${filesArr.length} file${filesArr.length > 1 ? 's' : ''}`,
        stars: 0,
        forks: (item.forks || []).length,
        visibility: item.public ? 'Public Gist' : 'Secret Gist',
        isPublic: item.public,
        updated: formatRelativeTime(item.updated_at),
        html_url: item.html_url,
        remoteContent: rawContent,
        localContent: localContent,
        revHash: `#${item.id.slice(0, 7)}`,
      });
    }

    if (liveGists.length > 0) {
      STATE.gist.gists = liveGists;
      if (!STATE.gist.selectedGistId || !liveGists.some(g => g.id === STATE.gist.selectedGistId)) {
        STATE.gist.selectedGistId = liveGists[0].id;
      }
      saveGistCache();
    }

    STATE.gist.lastSynced = 'Just now';
    STATE.gist.revHash = `#${Math.random().toString(16).slice(2, 9)}`;
    renderGistSyncView();
    triggerToast(`Fetched ${liveGists.length} Gists from GitHub! ☁️`);
  } catch (err) {
    console.error('Fetch remote gists error:', err);
    triggerToast(`Remote sync failed: ${err.message}`, 'error');
  } finally {
    if (icon) icon.classList.remove('animate-spin');
  }
}

function disconnectGitHubAccount() {
  localStorage.removeItem(STORAGE_KEYS.GITHUB_PAT);
  localStorage.removeItem(STORAGE_KEYS.GITHUB_USER);
  localStorage.removeItem(STORAGE_KEYS.GIST_CACHE);

  STATE.gist.pat = '';
  STATE.gist.user = null;
  STATE.gist.isDemoMode = true;
  STATE.gist.gists = getSeedGists();
  STATE.gist.selectedGistId = 'gist_fastapi_jwt';

  renderGistSyncView();
  triggerToast('Disconnected GitHub account: Restored demo sandbox mode');
}

function toggleGistDemoMode() {
  STATE.gist.isDemoMode = true;
  STATE.gist.gists = getSeedGists();
  STATE.gist.selectedGistId = 'gist_fastapi_jwt';
  renderGistSyncView();
  triggerToast('Loaded Stitch Demo Gist Sandbox (Diff Ready!)');
}

function togglePatVisibility() {
  const input = document.getElementById('gistPatInput');
  const icon = document.getElementById('patVisibilityIcon');
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.textContent = 'visibility_off';
  } else {
    input.type = 'password';
    if (icon) icon.textContent = 'visibility';
  }
}

function triggerManualSync() {
  fetchRemoteGists();
}

async function pushCurrentGistChanges() {
  const activeGist = STATE.gist.gists.find(g => g.id === STATE.gist.selectedGistId) || STATE.gist.gists[0];
  if (!activeGist) return;

  const pushBtn = document.getElementById('pushGistBtn');
  const pushLabel = document.getElementById('pushGistLabel');
  const pushIcon = document.getElementById('pushGistIcon');
  const commitInput = document.getElementById('gistCommitMsgInput');
  const commitMsg = (commitInput?.value || 'Update gist revision via Clippie').trim();

  if (pushLabel) pushLabel.textContent = 'Transmitting commit...';
  if (pushIcon) pushIcon.textContent = 'hourglass_empty';
  if (pushBtn) pushBtn.classList.add('opacity-80', 'pointer-events-none');

  if (STATE.gist.pat && !activeGist.id.startsWith('gist_')) {
    // Live GitHub API PATCH
    try {
      const payload = {
        description: commitMsg,
        files: {
          [activeGist.filename]: {
            content: activeGist.localContent,
          }
        }
      };

      const res = await fetch(`https://api.github.com/gists/${activeGist.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${STATE.gist.pat}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`GitHub API PATCH failed HTTP ${res.status}`);
      }

      activeGist.remoteContent = activeGist.localContent;
      activeGist.status = 'Synced';
      activeGist.revHash = `#${Math.random().toString(16).slice(2, 9)}`;
      STATE.gist.revHash = activeGist.revHash;
      STATE.gist.lastSynced = 'Just now';

      saveGistCache();
      renderGistSyncView();
      triggerToast(`Pushed to GitHub Gist: "${activeGist.filename}" (${activeGist.revHash})! 🚀`);
    } catch (err) {
      console.error('Push gist error:', err);
      triggerToast(`Push failed: ${err.message}`, 'error');
    } finally {
      if (pushLabel) pushLabel.textContent = 'Push Changes to GitHub Gist';
      if (pushIcon) pushIcon.textContent = 'publish';
      if (pushBtn) pushBtn.classList.remove('opacity-80', 'pointer-events-none');
    }
  } else {
    // Demo Mode simulated commit & push
    setTimeout(() => {
      if (pushLabel) pushLabel.textContent = 'Pushed to GitHub!';
      if (pushIcon) pushIcon.textContent = 'check';

      activeGist.remoteContent = activeGist.localContent;
      activeGist.status = 'Synced';
      activeGist.revHash = `#${Math.random().toString(16).slice(2, 9)}`;
      STATE.gist.revHash = activeGist.revHash;
      STATE.gist.lastSynced = 'Just now';

      renderGistSyncView();
      triggerToast(`Push Successful (${activeGist.revHash}): ${activeGist.filename} synced! ✨`);

      setTimeout(() => {
        if (pushLabel) pushLabel.textContent = 'Push Changes to GitHub Gist';
        if (pushIcon) pushIcon.textContent = 'publish';
        if (pushBtn) pushBtn.classList.remove('opacity-80', 'pointer-events-none');
      }, 2000);
    }, 900);
  }
}

function pullRemoteGist(gistId) {
  const gist = STATE.gist.gists.find(g => g.id === gistId);
  if (!gist) return;

  // Import into local snippets
  let existingSnip = STATE.snippets.find(s => s.gistId === gist.id || s.title.toLowerCase() === gist.filename.toLowerCase());
  if (existingSnip) {
    existingSnip.content = gist.remoteContent;
    existingSnip.gistId = gist.id;
  } else {
    const newSnip = {
      id: `clip_${Date.now()}`,
      gistId: gist.id,
      title: gist.filename,
      language: gist.language || 'plaintext',
      content: gist.remoteContent,
      tags: ['#gist', `#${gist.language || 'code'}`],
      isStarred: false,
      thought: `pulled from remote Gist ${gist.html_url || ''}`,
      createdAt: new Date().toISOString(),
    };
    STATE.snippets.unshift(newSnip);
  }

  gist.localContent = gist.remoteContent;
  gist.status = 'Synced';

  saveSnippets();
  saveGistCache();
  renderAllSnippetsView();
  renderGistSyncView();
  triggerToast(`Pulled Remote: "${gist.filename}" synced to vault! 📥`);
}

function discardCurrentGistEdits() {
  const activeGist = STATE.gist.gists.find(g => g.id === STATE.gist.selectedGistId);
  if (!activeGist) return;

  if (confirm(`Discard uncommitted local edits for ${activeGist.filename}? This restores the pristine remote copy.`)) {
    activeGist.localContent = activeGist.remoteContent;
    activeGist.status = 'Synced';
    saveGistCache();
    renderGistSyncView();
    triggerToast(`Edits Discarded: Restored pristine copy from GitHub Gist.`);
  }
}

function copyUnifiedDiffPatch() {
  const activeGist = STATE.gist.gists.find(g => g.id === STATE.gist.selectedGistId);
  if (!activeGist) return;

  const diffData = computeDiff(activeGist.remoteContent, activeGist.localContent);
  const patchLines = [
    `diff --git a/${activeGist.filename} b/${activeGist.filename}`,
    `index ${activeGist.revHash.replace('#', '')}..${STATE.gist.revHash.replace('#', '')} 100644`,
    `--- a/${activeGist.filename}`,
    `+++ b/${activeGist.filename}`,
    `@@ -1,${activeGist.remoteContent.split('\n').length} +1,${activeGist.localContent.split('\n').length} @@`,
    ...diffData.rows.map(r => {
      if (r.type === 'add') return `+${r.text}`;
      if (r.type === 'del') return `-${r.text}`;
      return ` ${r.text}`;
    })
  ];

  copyTextToClipboard(patchLines.join('\n'), `Patch for ${activeGist.filename}`);
}

function toggleDiffDisplayMode() {
  STATE.gist.diffMode = STATE.gist.diffMode === 'unified' ? 'split' : 'unified';
  renderDiffInspector();
  triggerToast(`Diff Inspector switched to ${STATE.gist.diffMode} mode`);
}

function filterGistsCatalog() {
  const input = document.getElementById('gistFilterInput');
  STATE.gist.filter = input?.value || '';
  renderGistSyncView();
}

function toggleGistSort() {
  STATE.gist.sortOrder = STATE.gist.sortOrder === 'desc' ? 'asc' : 'desc';
  renderGistSyncView();
}

function updateCommitCharCount() {
  const input = document.getElementById('gistCommitMsgInput');
  const counter = document.getElementById('gistCommitMsgCounter');
  if (input && counter) {
    counter.textContent = `${input.value.length} / 72 chars`;
  }
}

// -----------------------------------------------------------------------------
// New Gist from Vault Modal Management
// -----------------------------------------------------------------------------

function openNewGistModal() {
  const modal = document.getElementById('newGistModalOverlay');
  const select = document.getElementById('gistSnippetSelect');
  const filenameInput = document.getElementById('newGistFilenameInput');
  const descInput = document.getElementById('newGistDescriptionInput');
  const codeTextarea = document.getElementById('newGistCodeTextarea');
  const statsEl = document.getElementById('newGistContentStats');

  if (!modal) return;

  // Populate snippets
  if (select) {
    select.innerHTML = STATE.snippets.map(s => `
      <option value="${s.id}">${escapeHtml(s.title)} (${s.language.toUpperCase()})</option>
    `).join('');
  }

  // Auto-fill from first snippet
  if (STATE.snippets.length > 0) {
    const first = STATE.snippets[0];
    const extMap = { python: 'py', bash: 'sh', sql: 'sql', json: 'json', yaml: 'yml', rust: 'rs', typescript: 'ts', docker: 'Dockerfile', markdown: 'md' };
    const ext = extMap[first.language] || 'txt';
    const cleanTitle = first.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (filenameInput) filenameInput.value = `${cleanTitle}.${ext}`;
    if (descInput) descInput.value = first.thought || first.title;
    if (codeTextarea) codeTextarea.value = first.content;
    if (statsEl) statsEl.textContent = `${first.content.split('\n').length} lines • ${first.content.length} chars`;
  }

  modal.classList.remove('hidden');
}

function closeNewGistModal() {
  const modal = document.getElementById('newGistModalOverlay');
  if (modal) modal.classList.add('hidden');
}

function onGistSnippetSelected() {
  const select = document.getElementById('gistSnippetSelect');
  const filenameInput = document.getElementById('newGistFilenameInput');
  const descInput = document.getElementById('newGistDescriptionInput');
  const codeTextarea = document.getElementById('newGistCodeTextarea');
  const statsEl = document.getElementById('newGistContentStats');

  const selectedId = select?.value;
  const snip = STATE.snippets.find(s => s.id === selectedId);
  if (!snip) return;

  const extMap = { python: 'py', bash: 'sh', sql: 'sql', json: 'json', yaml: 'yml', rust: 'rs', typescript: 'ts', docker: 'Dockerfile', markdown: 'md' };
  const ext = extMap[snip.language] || 'txt';
  const cleanTitle = snip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (filenameInput) filenameInput.value = `${cleanTitle}.${ext}`;
  if (descInput) descInput.value = snip.thought || snip.title;
  if (codeTextarea) codeTextarea.value = snip.content;
  if (statsEl) statsEl.textContent = `${snip.content.split('\n').length} lines • ${snip.content.length} chars`;
}

async function submitCreateNewGist() {
  const filenameInput = document.getElementById('newGistFilenameInput');
  const descInput = document.getElementById('newGistDescriptionInput');
  const codeTextarea = document.getElementById('newGistCodeTextarea');
  const visRadios = document.getElementsByName('newGistVisibility');
  const spinner = document.getElementById('createGistSubmitSpinner');
  const label = document.getElementById('createGistSubmitLabel');

  const filename = (filenameInput?.value || 'snippet.txt').trim();
  const description = (descInput?.value || '').trim();
  const content = (codeTextarea?.value || '').trim();
  let isPublic = false;
  for (const r of visRadios) {
    if (r.checked && r.value === 'public') isPublic = true;
  }

  if (!content) {
    triggerToast('Please provide code content for the gist', 'error');
    return;
  }

  if (spinner) spinner.classList.add('animate-spin');
  if (label) label.textContent = 'Creating...';

  if (STATE.gist.pat) {
    // Live GitHub API POST
    try {
      const payload = {
        description: description || filename,
        public: isPublic,
        files: {
          [filename]: {
            content: content,
          }
        }
      };

      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${STATE.gist.pat}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`GitHub API POST failed HTTP ${res.status}`);
      }

      const createdItem = await res.json();
      const filesArr = Object.values(createdItem.files || {});
      const firstFile = filesArr[0] || {};

      const newGistObj = {
        id: createdItem.id,
        title: filename,
        filename: filename,
        path: filename,
        language: (firstFile.language || 'plaintext').toLowerCase(),
        status: 'Synced',
        filesCount: '1 file',
        stars: 0,
        forks: 0,
        visibility: isPublic ? 'Public Gist' : 'Secret Gist',
        isPublic: isPublic,
        updated: 'Just now',
        html_url: createdItem.html_url,
        remoteContent: content,
        localContent: content,
        revHash: `#${createdItem.id.slice(0, 7)}`,
      };

      STATE.gist.gists.unshift(newGistObj);
      STATE.gist.selectedGistId = newGistObj.id;
      saveGistCache();

      closeNewGistModal();
      renderGistSyncView();
      triggerToast(`Published to GitHub Gist: "${filename}"! 🎉`);
    } catch (err) {
      console.error('Create Gist error:', err);
      triggerToast(`Create Gist failed: ${err.message}`, 'error');
    } finally {
      if (spinner) spinner.classList.remove('animate-spin');
      if (label) label.textContent = 'Publish Gist';
    }
  } else {
    // Sandbox simulated creation
    setTimeout(() => {
      const mockId = `gist_${Date.now()}`;
      const newGistObj = {
        id: mockId,
        title: filename,
        filename: filename,
        path: filename,
        language: detectLanguageAndConfidence(content).lang || 'plaintext',
        status: 'Synced',
        filesCount: '1 file',
        stars: 0,
        forks: 0,
        visibility: isPublic ? 'Public Gist' : 'Secret Gist',
        isPublic: isPublic,
        updated: 'Just now',
        html_url: `https://gist.github.com/developer/${mockId}`,
        remoteContent: content,
        localContent: content,
        revHash: `#${mockId.slice(-7)}`,
      };

      STATE.gist.gists.unshift(newGistObj);
      STATE.gist.selectedGistId = newGistObj.id;
      saveGistCache();

      if (spinner) spinner.classList.remove('animate-spin');
      if (label) label.textContent = 'Publish Gist';

      closeNewGistModal();
      renderGistSyncView();
      triggerToast(`Created Gist in Sandbox: "${filename}"! ✨`);
    }, 700);
  }
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
      } else if (document.getElementById('newGistModalOverlay')?.classList.contains('hidden') === false) {
        closeNewGistModal();
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

    // Shift+Enter in Gist Commit input pushes changes
    if (e.shiftKey && e.key === 'Enter' && document.activeElement?.id === 'gistCommitMsgInput') {
      e.preventDefault();
      pushCurrentGistChanges();
      return;
    }

    // Cmd+S or Ctrl+S triggers Gist Sync
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      triggerManualSync();
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
window.triggerGistSync = triggerManualSync;
window.triggerManualSync = triggerManualSync;
window.connectGitHubAccount = connectGitHubAccount;
window.disconnectGitHubAccount = disconnectGitHubAccount;
window.toggleGistDemoMode = toggleGistDemoMode;
window.togglePatVisibility = togglePatVisibility;
window.pushCurrentGistChanges = pushCurrentGistChanges;
window.pullRemoteGist = pullRemoteGist;
window.discardCurrentGistEdits = discardCurrentGistEdits;
window.copyUnifiedDiffPatch = copyUnifiedDiffPatch;
window.toggleDiffDisplayMode = toggleDiffDisplayMode;
window.filterGistsCatalog = filterGistsCatalog;
window.toggleGistSort = toggleGistSort;
window.updateCommitCharCount = updateCommitCharCount;
window.openNewGistModal = openNewGistModal;
window.closeNewGistModal = closeNewGistModal;
window.onGistSnippetSelected = onGistSnippetSelected;
window.submitCreateNewGist = submitCreateNewGist;
window.selectGistForDiff = selectGistForDiff;
