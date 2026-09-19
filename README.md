# 📋 Clippie — The Intelligent Pocket Clipboard & Snippet Suite

> **Version 2.0.0-PROD** • Engineered for Full-Stack Developers, DevOps Engineers, and Power Users.  
> Grounded in **Stitch Project ID: `9190291372802146778`** and the Clippie PRD & Information Architecture Blueprint.

---

## ⚡ Overview & Vision

**Clippie** is a hyper-minimalistic, local-first web utility designed to eliminate context-switching friction. It provides an instant "pocket clipboard" and structured workspace for terminal commands, infrastructure manifests, code templates, and markdown thought logs.

- **Zero Friction & Sub-50ms Speed**: Pure client-side local-first architecture powered by browser `localStorage`. Works 100% offline with zero server dependencies.
- **Intelligent AST Heuristics**: Lightweight regex engine that auto-detects snippet syntax on paste/typing and suggests smart semantic titles.
- **Multi-IDE Themes**: Switch instantly between **VS Code Dark+**, **Monokai Pro**, **GitHub Clean**, and **Solarized Dark**.
- **Ergonomic Adaptability**: Responsive 3-column CSS Grid desktop power-view with smooth transition to single-column thumb-optimized mobile layout with a floating action bar.

---

## 🚀 Workspaces & Features

| Workspace | Description |
| :--- | :--- |
| **All Snippets** | Responsive masonry grid or compact view with real-time fuzzy search, language filter chips, tag pills, soft-wrap, and line number toggles. |
| **Starred Vault** | E2EE encrypted vault for high-frequency code blocks, environment variable templates, and quick-access bindings (`⌥1`..`⌥9`). |
| **Clipboard History** | Real-time 100-item ring buffer daemon capturing copied text. Allows one-click syntax inspection and promotion to permanent snippets. |
| **Gist Sync** | Bi-directional cloud synchronization bridge with GitHub Gists, revision timeline, and rate-limit cache metrics. |
| **Preferences & IDE Profiles** | Interactive token switcher, typography scaling (12px, 13px, 15px), ligatures toggle, quota telemetry meter, and JSON backup tools. |

---

## ⌨️ Keyboard-First Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `/` | Focus global search palette |
| `N` | Open Rapid Capture modal |
| `⌘↵` or `Ctrl+Enter` | Commit and save snippet |
| `Esc` | Dismiss active modal or clear search query |
| `⌥1` .. `⌥9` | Quick-copy pinned Starred Vault item #1 through #9 |
| `⌘S` | Trigger manual Gist sync |
| `Tab` | Insert 2-space indentation inside code editor |
| `?` | Open keyboard shortcuts cheatsheet modal |

---

## 🌐 Deploying to Netlify (Recommended)

Clippie has zero build dependencies and is pre-configured with `netlify.toml` and `_redirects` for instant deployment.

### Method 1: Netlify Drop (Zero-Install, 30 Seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `clippie` folder onto the browser window.
3. Your live production URL will be generated immediately!

### Method 2: Netlify CLI
```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Deploy directly from the clippie folder
cd clippie
netlify deploy --prod --dir=.
```

### Method 3: GitHub / Git Push to Netlify
1. Push your repository to GitHub or GitLab.
2. In Netlify, click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select your repository. Netlify will automatically read `netlify.toml`:
   - **Base directory**: `.`
   - **Publish directory**: `.`
   - **Build command**: (Leave empty)
4. Click **Deploy Site**.

---

## ▲ Alternative Deployment: Vercel

If you prefer Vercel, the included `vercel.json` provides zero-config static routing:
```bash
npx vercel --prod
```

---

## 💻 Local Preview

Because Clippie is a modern static web application, you can run it locally with any web server or open it directly:

```bash
# Using Python
python -m http.server 3000

# Using Node / npx
npx serve .

# Or simply double-click index.html in your browser!
```

---

## 📁 Repository Structure

```
clippie/
├── index.html         # High-density UI shell with 5 workspaces and rapid capture modal
├── styles.css         # Theme engine tokens (VS Code, Monokai, GitHub, Solarized)
├── app.js             # AST heuristic scanner, colorizer, ring buffer, and storage
├── netlify.toml       # Netlify configuration with security headers & caching
├── _redirects         # Netlify SPA fallback routing
├── vercel.json        # Vercel fallback configuration
└── README.md          # Documentation & deployment guide
```
