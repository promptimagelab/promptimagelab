/* ============================================================
   PromptImageLab — Admin Auth Handler
   Routes: /admin, /admin/login, /admin/logout
   ============================================================ */

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'promptimagelab'
const SESSION_COOKIE = 'pil_admin_session'
const SESSION_TOKEN  = 'pil_admin_2026_secure_token'

/* ---- Session verification (used by admin-api.js) ---------- */
export async function verifyAdminSession(request) {
  const cookie = request.headers.get('cookie') || ''
  const match  = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  return match && match[1] === SESSION_TOKEN
}

/* ---- Main admin router ------------------------------------ */
export async function handleAdmin(request) {
  const url    = new URL(request.url)
  const path   = url.pathname
  const method = request.method

  if (path === '/admin/login') {
    if (method === 'POST') return handleLogin(request)
    return serveLoginPage()
  }
  if (path === '/admin/logout') return handleLogout()

  /* All other /admin/* — check session */
  const authed = await verifyAdminSession(request)
  if (!authed) {
    return Response.redirect(new URL('/admin/login', request.url).href, 302)
  }

  return serveAdminPage()
}

/* ---- Login POST ------------------------------------------ */
async function handleLogin(request) {
  let body
  try {
    const text = await request.text()
    const params = new URLSearchParams(text)
    body = { user: params.get('user'), pass: params.get('pass') }
  } catch {
    return serveLoginPage('Invalid request')
  }

  if (body.user === ADMIN_USER && body.pass === ADMIN_PASS) {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin',
        'Set-Cookie': `${SESSION_COOKIE}=${SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
      }
    })
  }
  return serveLoginPage('Invalid credentials')
}

/* ---- Logout --------------------------------------------- */
function handleLogout() {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/login',
      'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0`
    }
  })
}

/* ---- Login Page HTML ------------------------------------- */
function serveLoginPage(error = '') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Login — PromptImageLab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0f1e;--surface:#111827;--border:rgba(56,189,248,.15);--primary:#38bdf8;--text:#f1f5f9;--muted:#94a3b8;--error:#f87171}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.login-card{width:100%;max-width:400px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:40px;box-shadow:0 25px 60px rgba(0,0,0,.5)}
.logo{text-align:center;margin-bottom:32px}
.logo h1{font-size:1.5rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.logo p{color:var(--muted);font-size:.85rem;margin-top:6px}
label{display:block;font-size:.82rem;font-weight:600;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
input{width:100%;padding:12px 16px;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:.95rem;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.15)}
.form-group{margin-bottom:20px}
.btn-login{width:100%;padding:13px;background:linear-gradient(135deg,#38bdf8,#818cf8);border:none;border-radius:10px;color:#0a0f1e;font-weight:700;font-size:1rem;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s;margin-top:8px}
.btn-login:hover{opacity:.9;transform:translateY(-1px)}
.error{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.3);color:var(--error);padding:10px 14px;border-radius:8px;font-size:.85rem;margin-bottom:20px;text-align:center}
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">
    <h1>⚡ PromptImageLab</h1>
    <p>Admin Control Panel</p>
  </div>
  ${error ? `<div class="error">⚠️ ${error}</div>` : ''}
  <form method="POST" action="/admin/login">
    <div class="form-group">
      <label for="user">Username</label>
      <input type="text" id="user" name="user" required autocomplete="username" placeholder="admin">
    </div>
    <div class="form-group">
      <label for="pass">Password</label>
      <input type="password" id="pass" name="pass" required autocomplete="current-password" placeholder="••••••••••••">
    </div>
    <button type="submit" class="btn-login">Sign In →</button>
  </form>
</div>
</body>
</html>`
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-store' } })
}

/* ---- Admin Dashboard HTML -------------------------------- */
function serveAdminPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Admin Dashboard — PromptImageLab</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${ADMIN_CSS}
</style>
</head>
<body>
<div id="app">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <h1>⚡ PIL Admin</h1>
    </div>
    <nav class="sidebar-nav">
      <button class="nav-btn active" data-tab="dashboard" onclick="showTab('dashboard')">
        <span>📊</span> Dashboard
      </button>
      <button class="nav-btn" data-tab="pages" onclick="showTab('pages')">
        <span>📄</span> Pages
      </button>
      <button class="nav-btn" data-tab="prompts" onclick="showTab('prompts')">
        <span>✨</span> Prompts
      </button>
      <button class="nav-btn" data-tab="sitemap" onclick="showTab('sitemap'); loadSitemapXml()">
        <span>🗺️</span> Sitemap XML
      </button>
      <button class="nav-btn" data-tab="sql" onclick="showTab('sql')">
        <span>🗄️</span> SQL Execute
      </button>
    </nav>
    <div class="sidebar-footer">
      <a href="/" target="_blank" class="view-site-btn">🌐 View Site</a>
      <a href="/admin/logout" class="logout-btn">↩ Logout</a>
    </div>
  </aside>

  <!-- Main -->
  <main class="main-content">
    <!-- Top bar -->
    <header class="topbar">
      <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
      <span class="topbar-title" id="topbar-title">Dashboard</span>
      <div class="topbar-actions" id="topbar-actions"></div>
    </header>

    <!-- DASHBOARD TAB -->
    <section class="tab active" id="tab-dashboard">
      <div class="stats-grid" id="stats-grid">
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
        <div class="stat-card skeleton-card"><div class="skeleton" style="height:60px"></div></div>
      </div>
      <div class="card mt-24">
        <h3 class="card-title">Top Categories</h3>
        <div id="top-cats" class="cat-list">Loading…</div>
      </div>
    </section>

    <!-- PAGES TAB -->
    <section class="tab" id="tab-pages">
      <div class="tab-toolbar">
        <input type="search" id="pages-search" class="search-input" placeholder="Search pages…" oninput="debouncedPageSearch()">
        <select id="pages-status" class="select-input" onchange="loadPages()">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <button class="btn btn-primary" onclick="openPageModal()">+ New Page</button>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="pages-table">
          <thead><tr>
            <th><input type="checkbox" id="pages-check-all" onchange="toggleAllPages()"></th>
            <th>Title</th><th>Slug</th><th>Category</th><th>Status</th><th>Words</th><th>Updated</th><th>Actions</th>
          </tr></thead>
          <tbody id="pages-tbody"><tr><td colspan="8" class="loading-row">Loading…</td></tr></tbody>
        </table>
      </div>
      <div class="pagination" id="pages-pagination"></div>
      <div class="bulk-bar" id="pages-bulk-bar" style="display:none">
        <span id="bulk-count">0 selected</span>
        <button class="btn btn-danger" onclick="bulkDeletePages()">🗑 Delete Selected</button>
      </div>
    </section>

    <!-- PROMPTS TAB -->
    <section class="tab" id="tab-prompts">
      <div class="tab-toolbar">
        <input type="search" id="prompts-search" class="search-input" placeholder="Search prompts…" oninput="debouncedPromptSearch()">
        <select id="prompts-page-filter" class="select-input" onchange="loadPrompts()">
          <option value="">All Pages</option>
        </select>
        <button class="btn btn-primary" onclick="openPromptModal()">+ New Prompt</button>
      </div>
      <div class="table-wrap">
        <table class="data-table" id="prompts-table">
          <thead><tr>
            <th>ID</th><th>Page</th><th>Title</th><th>Body (preview)</th><th>Tags</th><th>Position</th><th>Actions</th>
          </tr></thead>
          <tbody id="prompts-tbody"><tr><td colspan="7" class="loading-row">Loading…</td></tr></tbody>
        </table>
      </div>
      <div class="pagination" id="prompts-pagination"></div>
    </section>

    <!-- SITEMAP TAB -->
    <section class="tab" id="tab-sitemap">
      <div class="card mt-24">
        <h3 class="card-title">Dynamic Sitemap XML</h3>
        <p style="color:var(--muted);margin-bottom:16px;">
          Live URL: <a href="https://promptimagelab.com/sitemap.xml" target="_blank" style="color:var(--primary);text-decoration:none;">https://promptimagelab.com/sitemap.xml</a>
        </p>
        <button class="btn btn-primary" onclick="loadSitemapXml()">⟳ Refresh Preview</button>
        <div style="margin-top:20px;">
          <textarea id="sitemap-preview" style="width:100%;height:400px;background:#0a1628;color:#e2e8f0;font-family:'Fira Code','Consolas',monospace;font-size:0.85rem;padding:14px;border-radius:12px;border:1px solid rgba(56,189,248,.25);resize:vertical;white-space:pre;" spellcheck="false" readonly>Click "Refresh Preview" to view the live sitemap...</textarea>
        </div>
      </div>
    </section>

    <!-- SQL EXECUTE TAB -->
    <section class="tab" id="tab-sql">
      <div class="sql-editor-wrap">
        <div class="sql-toolbar">
          <span class="sql-label">🗄️ SQL Console — Cloudflare D1</span>
          <div style="display:flex;gap:8px;align-items:center;">
            <select id="sql-preset" class="select-input" style="font-size:.82rem;" onchange="loadSqlPreset()">
              <option value="">— Quick Queries —</option>
              <option value="SELECT * FROM pages ORDER BY updated_at DESC LIMIT 20;">List recent pages</option>
              <option value="SELECT * FROM categories ORDER BY position ASC;">List categories</option>
              <option value="SELECT * FROM prompts ORDER BY id DESC LIMIT 20;">List prompts</option>
              <option value="SELECT COUNT(*) AS pages, (SELECT COUNT(*) FROM categories) AS categories, (SELECT COUNT(*) FROM prompts) AS prompts FROM pages;">DB stats</option>
              <option value="SELECT p.id, p.slug, p.title, COUNT(pr.id) AS prompt_count FROM pages p LEFT JOIN prompts pr ON pr.page_id = p.id GROUP BY p.id ORDER BY prompt_count DESC LIMIT 15;">Pages by prompt count</option>
              <option value="PRAGMA table_list;">List tables</option>
              <option value="PRAGMA table_info(pages);">Schema: pages</option>
              <option value="PRAGMA table_info(prompts);">Schema: prompts</option>
              <option value="PRAGMA table_info(categories);">Schema: categories</option>
            </select>
            <button class="btn btn-primary" onclick="runSql()" id="run-sql-btn">▶ Run</button>
            <button class="btn btn-secondary" onclick="clearSql()">✕ Clear</button>
          </div>
        </div>
        <div class="sql-editor-container">
          <textarea id="sql-editor" class="sql-editor" placeholder="Enter SQL query…\nExamples:\n  SELECT * FROM pages LIMIT 10;\n  INSERT INTO categories (slug, name) VALUES ('art', 'Art');\n  UPDATE pages SET status='published' WHERE id=1;" spellcheck="false"></textarea>
        </div>
        <div id="sql-status-bar" class="sql-status-bar"></div>
        <div id="sql-results" class="sql-results">
          <div class="sql-welcome">
            <div class="sql-welcome-icon">🗄️</div>
            <h3>SQL Console</h3>
            <p>Write any SQL query above and press <strong>▶ Run</strong> to execute it against your Cloudflare D1 database.</p>
            <p style="margin-top:8px;font-size:.82rem;">Supports SELECT, INSERT, UPDATE, DELETE, PRAGMA statements, and more.</p>
          </div>
        </div>
        <div id="sql-history-wrap" class="sql-history-wrap">
          <div class="sql-history-header">
            <span>📋 Query History</span>
            <button class="btn btn-sm btn-secondary" onclick="clearSqlHistory()">Clear</button>
          </div>
          <div id="sql-history-list" class="sql-history-list"></div>
        </div>
      </div>
    </section>
  </main>
</div>

<!-- MODAL OVERLAY -->
<div class="modal-overlay" id="modal-overlay" onclick="closeModal(event)">
  <div class="modal" id="modal">
    <div class="modal-header">
      <h2 id="modal-title">Edit</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>

<!-- CONFIRM DIALOG -->
<div class="modal-overlay" id="confirm-overlay" style="display:none">
  <div class="modal" style="max-width:400px">
    <div class="modal-header"><h2 id="confirm-title">Confirm</h2></div>
    <div class="modal-body">
      <p id="confirm-msg" style="margin-bottom:24px;color:var(--muted)"></p>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="confirmNo()">Cancel</button>
        <button class="btn btn-danger" id="confirm-yes-btn">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<script>
${ADMIN_JS}
</script>
</body>
</html>`
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-store' } })
}

/* ===========================================================
   ADMIN CSS
   =========================================================== */
const ADMIN_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070d1a;--surface:#0f1629;--surface2:#162035;
  --border:rgba(56,189,248,.12);--border2:rgba(56,189,248,.22);
  --primary:#38bdf8;--secondary:#818cf8;--success:#4ade80;
  --danger:#f87171;--warning:#fbbf24;
  --text:#f1f5f9;--muted:#64748b;--muted2:#94a3b8;
  --sidebar-w:240px
}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
#app{display:flex;min-height:100vh}

/* Sidebar */
.sidebar{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .3s}
.sidebar-header{padding:20px 20px 16px;border-bottom:1px solid var(--border)}
.sidebar-header h1{font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sidebar-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
.nav-btn{width:100%;padding:10px 14px;background:transparent;border:none;border-radius:10px;color:var(--muted2);font-size:.9rem;font-weight:500;font-family:inherit;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;transition:all .2s}
.nav-btn:hover{background:rgba(56,189,248,.08);color:var(--text)}
.nav-btn.active{background:rgba(56,189,248,.12);color:var(--primary);font-weight:600}
.sidebar-footer{padding:16px 12px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px}
.view-site-btn,.logout-btn{padding:9px 14px;border-radius:8px;font-size:.85rem;font-weight:600;text-align:center;text-decoration:none;transition:all .2s}
.view-site-btn{background:rgba(56,189,248,.1);color:var(--primary);border:1px solid rgba(56,189,248,.2)}
.view-site-btn:hover{background:rgba(56,189,248,.2)}
.logout-btn{background:rgba(248,113,113,.08);color:var(--danger);border:1px solid rgba(248,113,113,.15)}
.logout-btn:hover{background:rgba(248,113,113,.15)}

/* Main */
.main-content{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{padding:0 24px;height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:50}
.menu-toggle{background:none;border:none;color:var(--muted2);font-size:1.2rem;cursor:pointer;padding:6px;border-radius:6px;display:none}
.menu-toggle:hover{color:var(--text)}
.topbar-title{font-weight:700;font-size:1rem;flex:1}
.topbar-actions{display:flex;gap:10px}

/* Tabs */
.tab{display:none;padding:24px;flex:1;animation:fadeIn .2s ease}
.tab.active{display:block}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
.stat-card .stat-val{font-size:2rem;font-weight:800;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.stat-card .stat-label{color:var(--muted2);font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.stat-card .stat-sub{color:var(--muted);font-size:.78rem;margin-top:4px}

/* Card */
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
.card-title{font-size:1rem;font-weight:700;margin-bottom:16px}
.mt-24{margin-top:24px}
.cat-list{display:flex;flex-direction:column;gap:8px}
.cat-row{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--surface2);border-radius:8px}
.cat-row-name{font-weight:600;font-size:.9rem}
.cat-row-cnt{color:var(--muted2);font-size:.8rem}

/* Toolbar */
.tab-toolbar{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.search-input,.select-input{padding:9px 14px;background:var(--surface);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s}
.search-input{min-width:220px;flex:1}
.select-input{background:var(--surface)}
.search-input:focus,.select-input:focus{border-color:var(--primary)}

/* Buttons */
.btn{padding:9px 18px;border-radius:8px;border:none;font-weight:600;font-size:.88rem;font-family:inherit;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:linear-gradient(135deg,#38bdf8,#818cf8);color:#0a0f1e}
.btn-primary:hover{opacity:.9;transform:translateY(-1px)}
.btn-secondary{background:var(--surface2);border:1px solid var(--border2);color:var(--text)}
.btn-secondary:hover{border-color:var(--primary)}
.btn-danger{background:rgba(248,113,113,.15);border:1px solid rgba(248,113,113,.3);color:var(--danger)}
.btn-danger:hover{background:rgba(248,113,113,.25)}
.btn-sm{padding:6px 12px;font-size:.8rem}
.btn-icon{padding:6px 10px;font-size:.8rem}

/* Table */
.table-wrap{overflow:auto;max-height:600px;border-radius:12px;border:1px solid var(--border)}
.data-table{width:100%;border-collapse:collapse;font-size:.88rem}
.data-table th{padding:12px 14px;text-align:left;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);background:var(--surface2);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:2}
.data-table td{padding:12px 14px;border-bottom:1px solid var(--border);vertical-align:middle}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:rgba(56,189,248,.03)}
.loading-row{text-align:center;color:var(--muted);padding:32px!important}

/* Badges */
.badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:.72rem;font-weight:700}
.badge-published{background:rgba(74,222,128,.1);color:var(--success);border:1px solid rgba(74,222,128,.2)}
.badge-draft{background:rgba(251,191,36,.1);color:var(--warning);border:1px solid rgba(251,191,36,.2)}
.badge-archived{background:rgba(100,116,139,.1);color:var(--muted2);border:1px solid rgba(100,116,139,.2)}

/* Pagination */
.pagination{display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap}
.page-btn{padding:7px 13px;border-radius:8px;border:1px solid var(--border2);background:var(--surface);color:var(--muted2);font-family:inherit;font-size:.85rem;cursor:pointer;transition:all .2s}
.page-btn:hover,.page-btn.active{background:rgba(56,189,248,.12);border-color:var(--primary);color:var(--primary)}

/* Bulk bar */
.bulk-bar{display:flex;align-items:center;gap:14px;padding:12px 16px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);border-radius:10px;margin-top:12px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:none;align-items:center;justify-content:center;padding:20px}
.modal-overlay.open{display:flex}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:18px;width:100%;max-width:700px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.6)}
.modal-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.modal-header h2{font-size:1.1rem;font-weight:700}
.modal-close{background:none;border:none;color:var(--muted2);font-size:1.2rem;cursor:pointer;padding:4px 8px;border-radius:6px}
.modal-close:hover{background:rgba(255,255,255,.06);color:var(--text)}
.modal-body{padding:24px;overflow-y:auto;flex:1}
.modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:12px;justify-content:flex-end}

/* Form */
.form-group{margin-bottom:18px}
.form-group label{display:block;font-size:.8rem;font-weight:600;color:var(--muted2);margin-bottom:7px;text-transform:uppercase;letter-spacing:.4px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:10px;color:var(--text);font-size:.9rem;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.1)}
.form-group textarea{resize:vertical;min-height:140px;line-height:1.6}
.form-group select option{background:var(--surface)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.char-count{font-size:.75rem;color:var(--muted);text-align:right;margin-top:4px}

/* Tags input */
.tags-wrap{display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:10px;min-height:44px;cursor:text}
.tags-wrap:focus-within{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.1)}
.tag-chip{padding:3px 10px;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.25);border-radius:20px;font-size:.78rem;color:var(--primary);display:flex;align-items:center;gap:5px}
.tag-chip button{background:none;border:none;color:var(--primary);cursor:pointer;font-size:.85rem;padding:0;line-height:1}
.tags-input-inner{border:none;background:transparent;color:var(--text);font-family:inherit;font-size:.88rem;outline:none;flex:1;min-width:80px;padding:2px}

/* Toast */
.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:.9rem;font-weight:600;z-index:9999;opacity:0;transform:translateY(10px);transition:all .3s;pointer-events:none}
.toast.show{opacity:1;transform:translateY(0)}
.toast.success{background:#052e16;border:1px solid #166534;color:#4ade80}
.toast.error{background:#2d0a0a;border:1px solid #7f1d1d;color:#f87171}

/* Skeleton */
.skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px}
.skeleton-card{pointer-events:none}
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

/* Responsive */
@media(max-width:900px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .main-content{margin-left:0}
  .menu-toggle{display:block}
  .stats-grid{grid-template-columns:1fr 1fr}
  .form-row{grid-template-columns:1fr}
}
@media(max-width:500px){.stats-grid{grid-template-columns:1fr}}

/* SQL Execute */
.sql-editor-wrap{display:flex;flex-direction:column;gap:14px;height:calc(100vh - 120px)}
.sql-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
.sql-label{font-size:.88rem;font-weight:700;color:var(--primary);display:flex;align-items:center;gap:6px}
.sql-editor-container{position:relative;flex-shrink:0}
.sql-editor{width:100%;min-height:140px;max-height:280px;padding:14px 16px;background:#0a1628;border:1px solid rgba(56,189,248,.25);border-radius:12px;color:#e2e8f0;font-family:'Fira Code','Cascadia Code','Consolas',monospace;font-size:.9rem;line-height:1.65;resize:vertical;outline:none;transition:border-color .2s;tab-size:2}
.sql-editor:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(56,189,248,.12)}
.sql-editor::placeholder{color:#334155;font-style:italic}
.sql-status-bar{font-size:.8rem;padding:6px 14px;border-radius:8px;min-height:30px;display:flex;align-items:center;gap:10px;font-weight:600;letter-spacing:.2px}
.sql-status-bar.ok{background:rgba(74,222,128,.07);border:1px solid rgba(74,222,128,.2);color:var(--success)}
.sql-status-bar.err{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);color:var(--danger)}
.sql-status-bar.running{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.18);color:var(--warning)}
.sql-results{flex:1;overflow:auto;border-radius:12px;border:1px solid var(--border);background:var(--surface);min-height:160px}
.sql-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px;text-align:center;color:var(--muted)}
.sql-welcome-icon{font-size:2.5rem;margin-bottom:16px;opacity:.5}
.sql-welcome h3{font-size:1.1rem;font-weight:700;color:var(--muted2);margin-bottom:8px}
.sql-welcome p{font-size:.85rem;line-height:1.6;max-width:420px}
.sql-result-table-wrap{overflow:auto;max-height:340px}
.sql-result-table{width:100%;border-collapse:collapse;font-size:.82rem;font-family:'Fira Code','Consolas',monospace}
.sql-result-table th{padding:8px 12px;text-align:left;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--primary);background:rgba(56,189,248,.05);border-bottom:1px solid var(--border);white-space:nowrap;position:sticky;top:0;z-index:1}
.sql-result-table td{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.04);color:var(--text);white-space:nowrap;max-width:300px;overflow:hidden;text-overflow:ellipsis}
.sql-result-table tr:hover td{background:rgba(56,189,248,.04)}
.sql-result-table td.null-val{color:var(--muted);font-style:italic}
.sql-empty-result{padding:32px;text-align:center;color:var(--muted);font-size:.88rem}
.sql-history-wrap{border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden;flex-shrink:0;max-height:180px;display:flex;flex-direction:column}
.sql-history-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border);font-size:.8rem;font-weight:700;color:var(--muted2);flex-shrink:0}
.sql-history-list{overflow-y:auto;flex:1}
.sql-history-item{padding:8px 14px;font-size:.78rem;font-family:'Fira Code','Consolas',monospace;color:var(--muted2);cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:all .15s}
.sql-history-item:hover{background:rgba(56,189,248,.06);color:var(--text)}
.sql-history-item:last-child{border-bottom:none}
`

/* ===========================================================
   ADMIN JS
   =========================================================== */
const ADMIN_JS = `
'use strict';

/* ---- State -------------------------------------------- */
let pagesPage = 1, promptsPage = 1;
let selectedPages = new Set();
let pageSearchTimeout, promptSearchTimeout;
let confirmCallback = null;

/* ---- Init -------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadPages();
  loadPrompts();
  loadPagesDropdown();
  renderSqlHistory();
});

/* ---- Tab switching ----------------------------------- */
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector('[data-tab="' + name + '"]').classList.add('active');
  document.getElementById('topbar-title').textContent = name.charAt(0).toUpperCase() + name.slice(1);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ---- API --------------------------------------------- */
async function api(path, opts = {}) {
  const res = await fetch('/admin/api' + path, {
    headers: { 'content-type': 'application/json', ...opts.headers },
    ...opts
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

/* ---- Toast ------------------------------------------- */
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ---- Confirm dialog ---------------------------------- */
function confirm(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-overlay').style.display = 'flex';
  confirmCallback = cb;
  document.getElementById('confirm-yes-btn').onclick = () => { hideConfirm(); cb(); };
}
function confirmNo() { hideConfirm(); }
function hideConfirm() { document.getElementById('confirm-overlay').style.display = 'none'; }

/* ---- Modal ------------------------------------------- */
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.remove('open');
}

/* ==== DASHBOARD ==================================== */
async function loadStats() {
  try {
    const d = await api('/stats');
    const g = document.getElementById('stats-grid');
    g.innerHTML = \`
      <div class="stat-card">
        <div class="stat-val">\${d.pages.total ?? 0}</div>
        <div class="stat-label">Total Pages</div>
        <div class="stat-sub">\${d.pages.published ?? 0} published · \${d.pages.draft ?? 0} draft</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${d.prompts ?? 0}</div>
        <div class="stat-label">Prompts</div>
        <div class="stat-sub">Across all pages</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${d.categories ?? 0}</div>
        <div class="stat-label">Categories</div>
        <div class="stat-sub">Content taxonomy</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">\${(d.pages.total_words ?? 0).toLocaleString()}</div>
        <div class="stat-label">Total Words</div>
        <div class="stat-sub">Across all pages</div>
      </div>
    \`;
    const cats = d.topCats || [];
    document.getElementById('top-cats').innerHTML = cats.length
      ? cats.map(c => \`<div class="cat-row"><span class="cat-row-name">\${c.category || 'Uncategorized'}</span><span class="cat-row-cnt">\${c.cnt} pages</span></div>\`).join('')
      : '<p style="color:var(--muted)">No category data yet.</p>';
  } catch(e) { toast('Stats error: ' + e.message, 'error'); }
}

/* ==== PAGES ======================================== */
async function loadPages() {
  const search   = document.getElementById('pages-search').value.trim();
  const status   = document.getElementById('pages-status').value;
  const params   = new URLSearchParams({ page: pagesPage, limit: 20 });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const tbody = document.getElementById('pages-tbody');
  tbody.innerHTML = '<tr><td colspan="8" class="loading-row">Loading…</td></tr>';
  try {
    const d = await api('/pages?' + params);
    if (!d.data.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="loading-row">No pages found.</td></tr>';
    } else {
      tbody.innerHTML = d.data.map(p => \`
        <tr>
          <td><input type="checkbox" class="page-chk" value="\${p.id}" onchange="updateBulkBar()"></td>
          <td><strong>\${esc(p.title)}</strong></td>
          <td><a href="/\${p.slug}" target="_blank" class="slug-link">\${esc(p.slug)}</a></td>
          <td>\${esc(p.category || '—')}</td>
          <td><span class="badge badge-\${p.status || 'draft'}">\${p.status || 'draft'}</span></td>
          <td>\${(p.word_count || 0).toLocaleString()}</td>
          <td>\${fmtDate(p.updated_at)}</td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="editPage(\${p.id})">✏️</button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="deletePage(\${p.id})">🗑</button>
          </td>
        </tr>\`).join('');
    }
    renderPagination('pages', d.page, d.pages);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="8" class="loading-row">Error: ' + esc(e.message) + '</td></tr>';
  }
}

function debouncedPageSearch() {
  clearTimeout(pageSearchTimeout);
  pagesPage = 1;
  pageSearchTimeout = setTimeout(loadPages, 350);
}

function toggleAllPages() {
  const all = document.getElementById('pages-check-all').checked;
  document.querySelectorAll('.page-chk').forEach(c => { c.checked = all; });
  updateBulkBar();
}

function updateBulkBar() {
  const checked = document.querySelectorAll('.page-chk:checked');
  const bar = document.getElementById('pages-bulk-bar');
  document.getElementById('bulk-count').textContent = checked.length + ' selected';
  bar.style.display = checked.length ? 'flex' : 'none';
}

async function bulkDeletePages() {
  const ids = [...document.querySelectorAll('.page-chk:checked')].map(c => parseInt(c.value));
  if (!ids.length) return;
  confirm(\`Delete \${ids.length} pages? This cannot be undone.\`, async () => {
    try {
      await api('/pages/bulk-delete', { method: 'POST', body: JSON.stringify({ ids }) });
      toast('Deleted ' + ids.length + ' pages');
      loadPages();
      loadStats();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

function openPageModal(page = null) {
  const isEdit = !!page;
  const tags = isEdit ? parseTagsDisplay(page.tags) : [];
  const related = isEdit ? parseTagsDisplay(page.related) : [];
  openModal(isEdit ? 'Edit Page' : 'New Page', \`
    <form id="page-form" onsubmit="submitPage(event, \${isEdit ? page.id : 'null'})">
      <div class="form-row">
        <div class="form-group">
          <label>Title *</label>
          <input type="text" name="title" value="\${esc(page?.title || '')}" required oninput="autoSlug(this)">
        </div>
        <div class="form-group">
          <label>Slug *</label>
          <input type="text" name="slug" id="page-slug" value="\${esc(page?.slug || '')}" required pattern="[a-z0-9-]+" title="Lowercase letters, numbers, hyphens only">
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <input type="text" name="description" value="\${esc(page?.description || '')}" maxlength="160" oninput="this.nextElementSibling.textContent=this.value.length+'/160'">
        <div class="char-count">\${(page?.description || '').length}/160</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category</label>
          <input type="text" name="category" value="\${esc(page?.category || '')}" list="cat-datalist">
          <datalist id="cat-datalist"></datalist>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="draft" \${(page?.status||'draft')==='draft'?'selected':''}>Draft</option>
            <option value="published" \${page?.status==='published'?'selected':''}>Published</option>
            <option value="archived" \${page?.status==='archived'?'selected':''}>Archived</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tags-wrap" id="tags-wrap">\${tags.map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">×</button></span>\`).join('')}<input class="tags-input-inner" id="tags-inner" placeholder="Add tag, press Enter…" onkeydown="handleTagKey(event,'tags-wrap')"></div>
        <input type="hidden" name="tags" id="tags-hidden" value="\${esc(page?.tags || '[]')}">
      </div>
      <div class="form-group">
        <label>Related Pages (slugs)</label>
        <div class="tags-wrap" id="related-wrap">\${related.map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">×</button></span>\`).join('')}<input class="tags-input-inner" id="related-inner" placeholder="Add slug, press Enter…" onkeydown="handleTagKey(event,'related-wrap')"></div>
        <input type="hidden" name="related" id="related-hidden" value="\${esc(page?.related || '[]')}">
      </div>
      <div class="form-group">
        <label>Content (HTML)</label>
        <textarea name="content" id="page-content" rows="12">\${esc(page?.content || '')}</textarea>
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">\${isEdit ? '💾 Save Changes' : '➕ Create Page'}</button>
      </div>
    </form>
  \`);
  loadCatDatalist();
}

async function editPage(id) {
  try {
    const page = await api('/pages/' + id);
    openPageModal(page);
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function submitPage(e, id) {
  e.preventDefault();
  syncTags('tags-wrap', 'tags-hidden');
  syncTags('related-wrap', 'related-hidden');
  const form = e.target;
  const data = {
    slug: form.slug.value.trim(),
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    category: form.category.value.trim(),
    status: form.status.value,
    tags: form.tags.value || '[]',
    related: form.related.value || '[]',
    content: form.content.value
  };
  try {
    if (id) {
      await api('/pages/' + id, { method: 'PUT', body: JSON.stringify(data) });
      toast('Page updated ✓');
    } else {
      await api('/pages', { method: 'POST', body: JSON.stringify(data) });
      toast('Page created ✓');
    }
    closeModal();
    loadPages();
    loadStats();
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function deletePage(id) {
  confirm('Delete this page? This cannot be undone.', async () => {
    try {
      await api('/pages/' + id, { method: 'DELETE' });
      toast('Page deleted');
      loadPages();
      loadStats();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

/* ==== PROMPTS ====================================== */
async function loadPrompts() {
  const search  = document.getElementById('prompts-search').value.trim();
  const page_id = document.getElementById('prompts-page-filter').value;
  const params  = new URLSearchParams({ page: promptsPage, limit: 20 });
  if (search) params.set('search', search);
  if (page_id) params.set('page_id', page_id);
  const tbody = document.getElementById('prompts-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Loading…</td></tr>';
  try {
    const d = await api('/prompts?' + params);
    if (!d.data.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No prompts found.</td></tr>';
    } else {
      tbody.innerHTML = d.data.map(p => \`
        <tr>
          <td>\${p.id}</td>
          <td>\${p.page_title ? \`<a href="/\${p.page_slug}" target="_blank">\${esc(p.page_title)}</a>\` : '—'}</td>
          <td>\${esc(p.title || '—')}</td>
          <td class="prompt-preview">\${esc((p.body || '').slice(0, 80))}\${p.body && p.body.length > 80 ? '…' : ''}</td>
          <td>\${esc(p.tags || '[]')}</td>
          <td>\${p.position}</td>
          <td class="actions-cell">
            <button class="btn btn-sm btn-secondary btn-icon" onclick="editPrompt(\${p.id})">✏️</button>
            <button class="btn btn-sm btn-danger btn-icon" onclick="deletePrompt(\${p.id})">🗑</button>
          </td>
        </tr>\`).join('');
    }
    renderPagination('prompts', d.page, d.pages);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Error: ' + esc(e.message) + '</td></tr>';
  }
}

function debouncedPromptSearch() {
  clearTimeout(promptSearchTimeout);
  promptsPage = 1;
  promptSearchTimeout = setTimeout(loadPrompts, 350);
}

function openPromptModal(prompt = null) {
  const isEdit = !!prompt;
  openModal(isEdit ? 'Edit Prompt' : 'New Prompt', \`
    <form id="prompt-form" onsubmit="submitPrompt(event, \${isEdit ? prompt.id : 'null'})">
      <div class="form-row">
        <div class="form-group">
          <label>Page *</label>
          <select name="page_id" id="prompt-page-select" required>
            <option value="">Select page…</option>
          </select>
        </div>
        <div class="form-group">
          <label>Position</label>
          <input type="number" name="position" value="\${prompt?.position ?? 0}" min="0">
        </div>
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" value="\${esc(prompt?.title || '')}">
      </div>
      <div class="form-group">
        <label>Body *</label>
        <textarea name="body" required rows="6">\${esc(prompt?.body || '')}</textarea>
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tags-wrap" id="ptags-wrap">\${parseTagsDisplay(prompt?.tags).map(t=>\`<span class="tag-chip">\${esc(t)}<button type="button" onclick="removeTag(this)">×</button></span>\`).join('')}<input class="tags-input-inner" id="ptags-inner" placeholder="Add tag…" onkeydown="handleTagKey(event,'ptags-wrap')"></div>
        <input type="hidden" name="tags" id="ptags-hidden" value="\${esc(prompt?.tags || '[]')}">
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">\${isEdit ? '💾 Save' : '➕ Create'}</button>
      </div>
    </form>
  \`);
  // populate pages dropdown
  loadPagesInSelect('prompt-page-select', prompt?.page_id);
}

async function editPrompt(id) {
  try {
    const p = await api('/prompts/' + id);
    openPromptModal(p);
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function submitPrompt(e, id) {
  e.preventDefault();
  syncTags('ptags-wrap', 'ptags-hidden');
  const form = e.target;
  const data = {
    page_id: parseInt(form.page_id.value),
    title: form.title.value.trim(),
    body: form.body.value.trim(),
    tags: form.tags.value || '[]',
    position: parseInt(form.position.value) || 0
  };
  try {
    if (id) {
      await api('/prompts/' + id, { method: 'PUT', body: JSON.stringify(data) });
      toast('Prompt updated ✓');
    } else {
      await api('/prompts', { method: 'POST', body: JSON.stringify(data) });
      toast('Prompt created ✓');
    }
    closeModal();
    loadPrompts();
  } catch(e) { toast('Error: ' + e.message, 'error'); }
}

async function deletePrompt(id) {
  confirm('Delete this prompt?', async () => {
    try {
      await api('/prompts/' + id, { method: 'DELETE' });
      toast('Prompt deleted');
      loadPrompts();
    } catch(e) { toast('Error: ' + e.message, 'error'); }
  });
}

/* ==== SITEMAP XML ================================== */
async function loadSitemapXml() {
  const ta = document.getElementById('sitemap-preview');
  ta.value = 'Loading sitemap...';
  try {
    const res = await fetch('/sitemap.xml');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    ta.value = text;
  } catch (e) {
    ta.value = 'Error loading sitemap: ' + e.message;
  }
}

/* ==== SQL EXECUTE ================================== */
let sqlHistory = JSON.parse(localStorage.getItem('admin_sql_history') || '[]');

function loadSqlPreset() {
  const sel = document.getElementById('sql-preset');
  if (sel.value) {
    document.getElementById('sql-editor').value = sel.value;
    sel.value = '';
  }
}

function clearSql() {
  document.getElementById('sql-editor').value = '';
  document.getElementById('sql-status-bar').className = 'sql-status-bar';
  document.getElementById('sql-status-bar').textContent = '';
  document.getElementById('sql-results').innerHTML = '<div class="sql-welcome"><div class="sql-welcome-icon">🗄️</div><h3>SQL Console</h3><p>Write any SQL query above and press <strong>▶ Run</strong> to execute it.</p></div>';
}

async function runSql() {
  const editor = document.getElementById('sql-editor');
  const sql = editor.value.trim();
  if (!sql) { toast('Enter a SQL query first', 'error'); return; }

  const statusBar = document.getElementById('sql-status-bar');
  const resultsEl = document.getElementById('sql-results');
  const btn = document.getElementById('run-sql-btn');

  btn.disabled = true;
  btn.textContent = '⏳ Running…';
  statusBar.className = 'sql-status-bar running';
  statusBar.textContent = 'Executing query…';
  resultsEl.innerHTML = '<div class="sql-empty-result">Running SQL…</div>';

  const t0 = Date.now();
  try {
    const res = await fetch('/admin/api/sql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    const elapsed = Date.now() - t0;
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Query failed');

    // Save to history
    sqlHistory = [sql, ...sqlHistory.filter(h => h !== sql)].slice(0, 30);
    localStorage.setItem('admin_sql_history', JSON.stringify(sqlHistory));
    renderSqlHistory();

    const rows = data.results || [];
    const rowsChanged = data.rowsAffected ?? null;

    if (rows.length === 0 && rowsChanged === null) {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`✓ Query executed successfully · 0 rows · \${elapsed}ms\`;
      resultsEl.innerHTML = '<div class="sql-empty-result">✓ Query executed — no rows returned.</div>';
    } else if (rows.length > 0) {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`✓ \${rows.length} row\${rows.length !== 1 ? 's' : ''} returned · \${elapsed}ms\`;
      resultsEl.innerHTML = renderSqlTable(rows);
    } else {
      statusBar.className = 'sql-status-bar ok';
      statusBar.textContent = \`✓ \${rowsChanged ?? 0} row\${rowsChanged !== 1 ? 's' : ''} affected · \${elapsed}ms\`;
      resultsEl.innerHTML = \`<div class="sql-empty-result">✓ \${rowsChanged ?? 0} row(s) affected.</div>\`;
    }
  } catch(e) {
    const elapsed = Date.now() - t0;
    statusBar.className = 'sql-status-bar err';
    statusBar.textContent = \`✗ Error · \${elapsed}ms\`;
    resultsEl.innerHTML = \`<div class="sql-empty-result" style="color:var(--danger)">⚠️ \${esc(e.message)}</div>\`;
  } finally {
    btn.disabled = false;
    btn.textContent = '▶ Run';
  }
}

function renderSqlTable(rows) {
  const cols = Object.keys(rows[0]);
  const thead = '<tr>' + cols.map(c => \`<th>\${esc(c)}</th>\`).join('') + '</tr>';
  const tbody = rows.map(r =>
    '<tr>' + cols.map(c => {
      const v = r[c];
      if (v === null || v === undefined) return '<td class="null-val">NULL</td>';
      return \`<td title="\${esc(String(v))}">\${esc(String(v))}</td>\`;
    }).join('') + '</tr>'
  ).join('');
  return \`<div class="sql-result-table-wrap"><table class="sql-result-table"><thead>\${thead}</thead><tbody>\${tbody}</tbody></table></div>\`;
}

function renderSqlHistory() {
  const el = document.getElementById('sql-history-list');
  if (!el) return;
  if (!sqlHistory.length) { el.innerHTML = '<div class="sql-empty-result" style="padding:16px">No history yet.</div>'; return; }
  el.innerHTML = sqlHistory.map((h, i) =>
    \`<div class="sql-history-item" onclick="loadFromHistory(\${i})" title="\${esc(h)}">\${esc(h)}</div>\`
  ).join('');
}

function loadFromHistory(i) {
  document.getElementById('sql-editor').value = sqlHistory[i];
}

function clearSqlHistory() {
  sqlHistory = [];
  localStorage.removeItem('admin_sql_history');
  renderSqlHistory();
}

// Ctrl+Enter to run SQL
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const active = document.querySelector('.tab.active');
    if (active && active.id === 'tab-sql') runSql();
  }
});

/* ==== HELPERS ====================================== */
function renderPagination(ns, current, total) {
  const el = document.getElementById(ns + '-pagination');
  if (total <= 1) { el.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += \`<button class="page-btn\${i===current?' active':''}" onclick="goPage('\${ns}',\${i})">\${i}</button>\`;
  }
  el.innerHTML = html;
}

function goPage(ns, p) {
  if (ns === 'pages') { pagesPage = p; loadPages(); }
  else if (ns === 'prompts') { promptsPage = p; loadPrompts(); }
}

function fmtDate(s) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function autoSlug(input) {
  const slugEl = document.getElementById('page-slug');
  if (slugEl && !slugEl.dataset.manual) slugEl.value = slugify(input.value);
}

function parseTagsDisplay(v) {
  if (!v) return [];
  try { const arr = JSON.parse(v); return Array.isArray(arr) ? arr : []; } catch { return []; }
}

function handleTagKey(e, wrapId) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.trim().replace(/,$/, '');
    if (!val) return;
    const wrap = document.getElementById(wrapId);
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = esc(val) + '<button type="button" onclick="removeTag(this)">×</button>';
    wrap.insertBefore(chip, e.target);
    e.target.value = '';
    syncTagsFromWrap(wrapId);
  }
}

function removeTag(btn) {
  const chip = btn.parentElement;
  const wrap = chip.parentElement;
  chip.remove();
  syncTagsFromWrap(wrap.id);
}

function syncTagsFromWrap(wrapId) {
  const hiddenId = wrapId === 'tags-wrap' ? 'tags-hidden' : wrapId === 'related-wrap' ? 'related-hidden' : 'ptags-hidden';
  syncTags(wrapId, hiddenId);
}

function syncTags(wrapId, hiddenId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const chips = [...wrap.querySelectorAll('.tag-chip')].map(c => c.textContent.replace('×','').trim());
  const hidden = document.getElementById(hiddenId);
  if (hidden) hidden.value = JSON.stringify(chips);
}

let pagesListCache = [];
async function loadPagesDropdown() {
  try {
    pagesListCache = await api('/pages-list');
    const sel = document.getElementById('prompts-page-filter');
    pagesListCache.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.title;
      sel.appendChild(o);
    });
  } catch {}
}

function loadPagesInSelect(selectId, selectedId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Select page…</option>';
  pagesListCache.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.title;
    if (p.id === selectedId) o.selected = true;
    sel.appendChild(o);
  });
}

async function loadCatDatalist() {
  try {
    const cats = await api('/categories');
    const dl = document.getElementById('cat-datalist');
    if (dl) cats.forEach(c => { const o = document.createElement('option'); o.value = c.slug; dl.appendChild(o); });
  } catch {}
}
`
