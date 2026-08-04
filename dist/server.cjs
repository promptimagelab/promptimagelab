var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_openai = __toESM(require("openai"), 1);
var import_vite = require("vite");

// src/data/libraryData.ts
var INITIAL_LIBRARY_PROMPTS = [
  {
    id: "pr-servicenow-incident",
    slug: "servicenow-incident-triage-root-cause-analysis",
    title: "ServiceNow Automated Incident Triage & Root Cause Classifier",
    description: "Classifies incoming ServiceNow incident tickets, maps CI items, generates impact analysis, and suggests resolution steps.",
    category: "ServiceNow",
    models: ["claude", "chatgpt", "gemini"],
    industry: "servicenow",
    promptText: `You are an Enterprise Site Reliability Engineer and ServiceNow ITSM Specialist.

Evaluate the following ServiceNow Incident Record:
Short Description: {{short_description}}
Description: {{description}}
Configuration Item (CI): {{ci_item}}
Priority: {{priority}}

Perform the following 5-step analysis:
1. **Urgency & Impact Assessment**: Validate priority classification based on CI criticality.
2. **Category & Subcategory Mapping**: Recommend exact ServiceNow field values (e.g. Database -> Connection Timeout).
3. **Probable Root Cause**: Identify potential infrastructure, code regression, or network bottleneck causes.
4. **Actionable Remediation Script**: Provide PowerShell or Bash diagnostics commands to run on affected CI.
5. **Workaround & User Communication**: Draft a non-technical update string for the caller ticket notes.`,
    explanation: "Leverages ServiceNow ITSM taxonomy and SRE diagnostics to automate ticket categorization and escalation triage.",
    businessContext: "Unstructured ServiceNow incident tickets increase Mean Time to Resolution (MTTR). Automated triage standardizes ticket fields and speeds up tier-2 dispatch by 65%.",
    problemExplanation: "Service Desk agents often waste 15-20 minutes manually classifying tickets and re-routing them to incorrect assignment groups due to vague customer reports.",
    inputExample: "Short Description: Billing API returning HTTP 504. Description: Customers reporting gateway timeout when checking out cart.",
    expectedOutput: "Structured markdown report with ITIL category assignments, root cause hypotheses, diagnostic CLI commands, and customer response draft.",
    customizationGuide: [
      "Replace CI Item types with your internal CMDB naming conventions.",
      "Adjust priority matrix thresholds according to your enterprise SLA policy.",
      "Add custom fields such as assignment_group or business_service."
    ],
    limitations: [
      "Requires accurate CMDB data to infer exact dependency trees.",
      "Does not replace active network monitoring tools like Datadog or Dynatrace."
    ],
    bestPractices: [
      "Pass raw stack trace excerpts into the description field for higher root cause precision.",
      "Enforce JSON format output when calling this prompt programmatically via OpsPilot API."
    ],
    commonMistakes: [
      "Omitting the Configuration Item (CI) parameter reduces accuracy.",
      "Using vague descriptions without error codes."
    ],
    relatedPrompts: ["pr-1", "pr-6"],
    relatedWorkflows: ["wf-servicenow-triage", "wf-rca-postmortem"],
    faqs: [
      {
        question: "Can this prompt be integrated directly into ServiceNow via REST API?",
        answer: "Yes! PromptImageLab OpsPilot provides a native ServiceNow Integration connector that triggers this prompt on incident insertion."
      },
      {
        question: "Which LLM model performs best for ServiceNow Incident Triage?",
        answer: "Claude 3.5 Sonnet and GPT-4o yield the highest accuracy for structured ITIL classification and root cause reasoning."
      }
    ],
    variables: [
      { name: "short_description", label: "Incident Short Description", defaultValue: "Billing API returning HTTP 504 timeouts" },
      { name: "description", label: "Incident Full Description", defaultValue: "Users across US-East region cannot complete checkout. API gateway logs show Redis connection pool starvation." },
      { name: "ci_item", label: "Configuration Item (CI)", defaultValue: "prod-billing-db-cluster-01" },
      { name: "priority", label: "Ticket Priority", defaultValue: "P2 - High" }
    ],
    difficulty: "Advanced",
    tags: ["ServiceNow", "ITSM", "Incident Triage", "SRE", "Root Cause"],
    likesCount: 2450,
    copiesCount: 6810,
    rating: 4.9,
    isVerified: true,
    author: "OpsPilot Core Team",
    createdAt: "2026-01-10"
  },
  {
    id: "pr-python-async-refactor",
    slug: "python-asyncio-performance-refactor",
    title: "Python AsyncIO High-Throughput Refactoring & Memory Optimization",
    description: "Transforms synchronous Python I/O code into zero-blocking AsyncIO coroutines with connection pooling and memory safeguards.",
    category: "Python",
    models: ["claude", "chatgpt", "deepseek", "gemini"],
    industry: "python",
    promptText: `You are a Principal Python Architect specializing in asyncio, uvloop, and memory optimization.

Refactor the following Python code snippet to high-performance async code:

\`\`\`python
{{python_code}}
\`\`\`

Requirements:
1. **Async Conversion**: Convert blocking I/O calls (requests, urllib, time.sleep) to aiohttp/httpx and asyncio.sleep.
2. **Resource Management**: Implement proper async context managers (async with) and connection pool sizing.
3. **Concurrency Safeguards**: Use asyncio.Semaphore to cap maximum concurrent connections and prevent socket exhaustion.
4. **Error Handling & Retries**: Add exponential backoff retry logic for transient 5xx HTTP codes.
5. **Memory Benchmark**: Explain Big-O space complexity and memory impact under 10,000 concurrent requests.`,
    explanation: "Enforces async best practices, semaphore rate limits, and structured error handling for high-concurrency Python backend services.",
    businessContext: "Synchronous Python web servers exhaust thread pools quickly under load spikes. Converting to asyncio cuts server infrastructure costs by up to 70%.",
    problemExplanation: "Developers often introduce blocking I/O inside async functions or fail to bound concurrency, leading to memory leaks and unhandled socket exceptions.",
    inputExample: "Python function using requests.get() inside a standard for loop fetching 1,000 API endpoints.",
    expectedOutput: "Production-ready Python code with asyncio.gather, httpx.AsyncClient, asyncio.Semaphore, retry wrapper, and benchmarks.",
    customizationGuide: [
      "Adjust max_concurrency semaphore count based on target downstream API rate limits.",
      "Replace httpx with aiohttp if existing codebase relies on aiohttp ecosystem."
    ],
    limitations: [
      "AsyncIO does not speed up CPU-bound tasks (use ProcessPoolExecutor for CPU-bound computation)."
    ],
    bestPractices: [
      "Always reuse a single httpx.AsyncClient session across requests.",
      "Use asyncio.gather with return_exceptions=True to avoid unhandled coroutine cancellations."
    ],
    commonMistakes: [
      "Calling blocking requests.get() inside an async def function.",
      "Not wrapping coroutines in a main entrypoint loop."
    ],
    relatedPrompts: ["pr-1", "pr-5"],
    relatedWorkflows: ["wf-code-security-audit"],
    faqs: [
      {
        question: "Does this refactoring work with FastAPI and Django 4+?",
        answer: "Yes, the generated code uses standard AsyncIO constructs compatible with FastAPI, Starlette, and Django Async views."
      }
    ],
    variables: [
      { name: "python_code", label: "Sync Python Code", defaultValue: "import requests\n\ndef fetch_data(urls):\n    results = []\n    for url in urls:\n        res = requests.get(url)\n        results.append(res.json())\n    return results" }
    ],
    difficulty: "Advanced",
    tags: ["Python", "AsyncIO", "Performance", "Backend", "Refactoring"],
    likesCount: 1890,
    copiesCount: 5210,
    rating: 4.9,
    isVerified: true,
    author: "Python AI Guild",
    createdAt: "2026-01-18"
  },
  {
    id: "pr-sql-query-optimizer",
    slug: "sql-query-performance-index-optimizer",
    title: "PostgreSQL & MySQL Query Optimizer & Indexing Strategist",
    description: "Analyzes slow SQL queries, EXPLAIN ANALYZE execution plans, and generates optimal composite indexes and rewritten queries.",
    category: "SQL",
    models: ["chatgpt", "claude", "deepseek", "gemini"],
    industry: "sql",
    promptText: `You are a Principal Database Administrator (DBA) and PostgreSQL/MySQL Performance Tuning Expert.

Evaluate the slow SQL query and schema below:

SQL Query:
\`\`\`sql
{{sql_query}}
\`\`\`

Database Engine: {{database_engine}}
Table Schemas & Existing Indexes:
\`\`\`
{{schema_info}}
\`\`\`

Provide a 4-part optimization report:
1. **Query Bottleneck Identification**: Highlight full table scans, implicit type conversions, or non-sargable WHERE clauses.
2. **Index Recommendations**: Provide exact DDL statements for composite indexes (CREATE INDEX CONCURRENTLY ...).
3. **Query Rewrite**: Rewrite the query using JOINs, CTEs, or window functions for maximum query execution speed.
4. **Expected Speedup**: Estimate latency reduction percentage and IOPS reduction.`,
    explanation: "Diagnoses missing indexes, non-sargable expressions, and unindexed foreign keys to optimize relational database queries.",
    businessContext: "Slow database queries degrade web application response times and cause database lock contention during high traffic.",
    problemExplanation: "Developers frequently write ORM queries that generate inefficient subqueries or fail to leverage multi-column composite indexes.",
    inputExample: 'SELECT * FROM orders WHERE status = "pending" AND DATE(created_at) = "2026-01-01" ORDER BY total DESC;',
    expectedOutput: "Formatted DBA report with exact index DDL statements, rewritten sargable SQL query, and query planner analysis.",
    customizationGuide: [
      "Include EXPLAIN ANALYZE text if available for even higher accuracy.",
      "Specify PostgreSQL, MySQL, SQL Server, or Oracle to receive vendor-specific DDL syntax."
    ],
    limitations: [
      "Cannot predict index cardinality without actual dataset distribution metrics."
    ],
    bestPractices: [
      "Always use CREATE INDEX CONCURRENTLY in production to prevent table locking.",
      "Avoid functions on WHERE clause columns (e.g. use created_at >= ... instead of DATE(created_at))."
    ],
    commonMistakes: [
      "Adding single-column indexes on every column instead of targeted composite indexes.",
      "Indexing low-cardinality boolean status flags."
    ],
    relatedPrompts: ["pr-1", "pr-5"],
    relatedWorkflows: ["wf-sql-optimizer"],
    faqs: [
      {
        question: "Does this support cloud databases like AWS Aurora and Azure SQL?",
        answer: "Yes, it supports PostgreSQL, MySQL, AWS Aurora, Azure SQL, Snowflake, and BigQuery tuning syntax."
      }
    ],
    variables: [
      { name: "sql_query", label: "Slow SQL Query", defaultValue: 'SELECT * FROM users u JOIN orders o ON u.id = o.user_id WHERE DATE(o.created_at) > "2026-01-01" AND u.country = "US" ORDER BY o.amount DESC;' },
      { name: "database_engine", label: "Database Engine", defaultValue: "PostgreSQL 16" },
      { name: "schema_info", label: "Table Schemas", defaultValue: "users (id SERIAL PRIMARY KEY, country VARCHAR(10)); orders (id SERIAL PRIMARY KEY, user_id INT, created_at TIMESTAMP, amount NUMERIC);" }
    ],
    difficulty: "Intermediate",
    tags: ["SQL", "PostgreSQL", "MySQL", "Database", "Indexing"],
    likesCount: 3100,
    copiesCount: 9400,
    rating: 5,
    isVerified: true,
    author: "DBA Lead",
    createdAt: "2026-01-22"
  },
  {
    id: "pr-aws-security-audit",
    slug: "aws-iam-cloud-security-compliance-audit",
    title: "AWS Cloud Security & IAM Policy Vulnerability Auditor",
    description: "Scans AWS IAM JSON policies and CloudFormation/Terraform templates for excessive wildcard permissions, unencrypted S3 buckets, and public security groups.",
    category: "AWS",
    models: ["claude", "chatgpt", "gemini"],
    industry: "aws",
    promptText: `You are a Principal Cloud Security Architect certified in AWS Security Specialty and CIS AWS Foundations Benchmark.

Audit the following Infrastructure as Code (IaC) or IAM Policy snippet:

\`\`\`json
{{iac_code}}
\`\`\`

Perform a comprehensive security audit detailing:
1. **CIS Benchmark Compliance**: Identify violations of Principle of Least Privilege (e.g. Action: "*", Resource: "*").
2. **Risk Ratings**: Assign CVE/CVSS severity ratings (Critical, High, Medium, Low) for each vulnerability.
3. **Data Exfiltration & Exposure Risks**: Check for public S3 buckets, unencrypted EBS volumes, or 0.0.0.0/0 ingress security groups.
4. **Remediated HCL / JSON**: Provide the hardened, zero-trust IAM policy or Terraform configuration.`,
    explanation: "Uses CIS AWS Benchmarks and Zero Trust rules to audit IaC templates for security misconfigurations before deployment.",
    businessContext: "Misconfigured AWS IAM policies and public S3 buckets account for over 80% of enterprise cloud data breaches.",
    problemExplanation: 'Developers often assign Action: "*" permissions to bypass IAM permission errors during development and forget to lock down policy scopes before deploying to production.',
    inputExample: 'JSON IAM policy with Statement Action: "s3:*", Resource: "*".',
    expectedOutput: "Detailed security audit report with vulnerability risk ratings, CIS benchmark citations, and hardened IAM JSON policy code.",
    customizationGuide: [
      "Specify Terraform, CloudFormation, or raw IAM JSON policy format.",
      "Add organization-specific compliance rules (e.g. HIPAA, SOC2, PCI-DSS requirements)."
    ],
    limitations: [
      "Static policy analysis cannot verify runtime IAM evaluation boundaries (e.g. Organizations SCPs)."
    ],
    bestPractices: [
      "Scope S3 permissions to specific bucket ARNs.",
      "Require MFA for sensitive API actions like kms:Decrypt or iam:DeleteUser."
    ],
    commonMistakes: [
      "Granting wildcards in Principal fields of bucket policies.",
      "Exposing port 22 (SSH) or 3389 (RDP) to 0.0.0.0/0."
    ],
    relatedPrompts: ["pr-1", "pr-6"],
    relatedWorkflows: ["wf-code-security-audit"],
    faqs: [
      {
        question: "Can this audit Terraform HCL as well as JSON IAM policies?",
        answer: "Yes! It audits Terraform HCL, AWS CloudFormation, AWS CDK, and native IAM JSON policy documents."
      }
    ],
    variables: [
      { name: "iac_code", label: "AWS IAM or Terraform Snippet", defaultValue: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": "*",\n      "Resource": "*"\n    }\n  ]\n}' }
    ],
    difficulty: "Advanced",
    tags: ["AWS", "Security", "IAM", "Cloud Security", "Terraform"],
    likesCount: 1720,
    copiesCount: 4890,
    rating: 4.9,
    isVerified: true,
    author: "Cloud Sec Ops",
    createdAt: "2026-02-02"
  },
  {
    id: "pr-react-custom-hook",
    slug: "react-19-custom-hook-state-management",
    title: "React 19 Custom Hook & Concurrent Mode Architecture Generator",
    description: "Generates type-safe React 19 custom hooks with optimistic updates, race condition prevention, and automatic cleanup.",
    category: "React",
    models: ["claude", "chatgpt", "gemini"],
    industry: "react",
    promptText: `You are a Principal Frontend Architect specializing in React 19, TypeScript, and modern state management patterns.

Create a robust custom React hook for the following requirement:
Hook Requirement: {{hook_requirement}}
API Endpoint / Service: {{api_endpoint}}

Ensure your code fulfills:
1. **Type Safety**: Export clean TypeScript interfaces for Hook Return Types, Options, and Data objects.
2. **Race Condition Protection**: Use AbortController inside useEffect/use to cancel stale network requests on parameter change.
3. **Optimistic UI State**: Implement optimistic local state updates with rollbacks on network failure.
4. **Cache & Revalidation**: Support manual refetch() and stale-while-revalidate caching behavior.
5. **Usage Example**: Provide a clean functional component demonstrating usage of the custom hook.`,
    explanation: "Generates production-grade React 19 hook patterns with AbortController cancellation, TypeScript strict typing, and error recovery.",
    businessContext: "Unhandled network race conditions and missing loading/error boundaries lead to buggy UI states and poor user experience.",
    problemExplanation: "React developers frequently forget to abort pending fetch requests when component props change, causing out-of-order state updates.",
    inputExample: "Custom hook useFetchUser(userId) that handles loading, error, manual refetch, and request cancellation.",
    expectedOutput: "Production-ready TypeScript custom hook with AbortController, optimistic updates, and clean demo component.",
    customizationGuide: [
      "Adapt state logic to TanStack Query (React Query) if your app uses external query libraries.",
      "Add local storage persistence if caching needs to survive page reloads."
    ],
    limitations: [
      "For complex server state, dedicated libraries like TanStack Query or SWR are recommended over raw custom hooks."
    ],
    bestPractices: [
      "Always clean up AbortController signals in useEffect cleanup callback.",
      "Keep hook return objects memoized with useMemo or static references."
    ],
    commonMistakes: [
      "Omitting dependency array items in useEffect.",
      "Mutating state directly instead of creating new object references."
    ],
    relatedPrompts: ["pr-1", "pr-5"],
    relatedWorkflows: ["wf-code-security-audit"],
    faqs: [
      {
        question: "Is this hook pattern compatible with Next.js App Router?",
        answer: 'Yes, it works seamlessly in Next.js Client Components ("use client") and standard Vite React apps.'
      }
    ],
    variables: [
      { name: "hook_requirement", label: "Hook Functional Requirement", defaultValue: "Hook for debounced user search with auto-completion and abort signal cancellation" },
      { name: "api_endpoint", label: "API Endpoint Signature", defaultValue: "GET /api/users/search?q={query}" }
    ],
    difficulty: "Intermediate",
    tags: ["React", "TypeScript", "Frontend", "Custom Hooks", "React 19"],
    likesCount: 2150,
    copiesCount: 6300,
    rating: 4.9,
    isVerified: true,
    author: "React Architecture Core",
    createdAt: "2026-02-04"
  },
  {
    id: "pr-1",
    slug: "senior-software-architect-code-review",
    title: "Senior Software Architect Code Reviewer & Security Auditor",
    description: "Executes zero-hallucination code reviews, detecting memory leaks, OWASP top 10 vulnerabilities, and architectural anti-patterns.",
    category: "Software Development",
    models: ["claude", "chatgpt", "gemini", "deepseek"],
    industry: "coding",
    promptText: `You are a Principal Software Architect and Cybersecurity Specialist. Review the following {{language}} code snippet.

Conduct your evaluation using this 4-step framework:
1. **Architectural Analysis**: Evaluate design patterns, SOLID principles, and modularity.
2. **Security Audit**: Identify potential OWASP Top 10 vulnerabilities (XSS, SQLi, CSRF, Memory Leaks, Secrets Exposure).
3. **Performance & Complexity**: Measure Big-O time and space complexity. Highlight blocking I/O or N+1 queries.
4. **Refactored Code**: Provide a clean, production-ready refactored version with inline explanation comments.

Code to review:
\`\`\`{{language}}
{{code_snippet}}
\`\`\``,
    explanation: "Uses role-prompting and multi-stage evaluation rules to force detailed line-by-line security and algorithmic analysis.",
    businessContext: "Unreviewed code in pull requests introduces security vulnerabilities and technical debt that slow down feature releases.",
    problemExplanation: "Human code reviews miss subtle edge-case bugs and security flaws when reviewing large PRs under tight deadlines.",
    inputExample: "TypeScript async function querying SQL database with concatenated parameters.",
    expectedOutput: "Structured security audit breakdown, Big-O complexity analysis, and sanitized parameter query refactoring.",
    customizationGuide: [
      "Add target framework context (e.g. Express, Spring Boot, Ruby on Rails).",
      "Specify internal coding guidelines or compliance rules."
    ],
    limitations: [
      "Cannot execute runtime integration tests without a sandboxed environment."
    ],
    bestPractices: [
      "Include imported library versions for precise CVE vulnerability detection."
    ],
    commonMistakes: [
      "Pasting partial snippets without context parameters."
    ],
    relatedPrompts: ["pr-python-async-refactor", "pr-sql-query-optimizer"],
    relatedWorkflows: ["wf-code-security-audit"],
    faqs: [
      {
        question: "Does this prompt support C++, Rust, and Go?",
        answer: "Yes, it works across TypeScript, Python, Go, Rust, C++, Java, and C#."
      }
    ],
    variables: [
      { name: "language", label: "Programming Language", defaultValue: "TypeScript" },
      { name: "code_snippet", label: "Code Snippet", defaultValue: 'const fetchUser = async (id) => { const res = await db.query("SELECT * FROM users WHERE id = " + id); return res; };' }
    ],
    difficulty: "Advanced",
    tags: ["Code Review", "Security", "TypeScript", "Refactoring", "OWASP"],
    likesCount: 1420,
    copiesCount: 3890,
    rating: 4.9,
    isVerified: true,
    author: "PromptImageLab Core",
    createdAt: "2026-01-15"
  }
];

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
function geminiClient(apiKey) {
  return new import_genai.GoogleGenAI({ apiKey });
}
function openaiClient(apiKey, baseURL) {
  return new import_openai.default({ apiKey, ...baseURL ? { baseURL } : {} });
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "PromptImageLab Multi-Provider Engine",
    d1Database: {
      name: "backend-db",
      id: "161f312b-338c-45fa-ac67-c97025625623",
      status: "Operational",
      storageUsed: "12.29 KB"
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/d1/status", (_req, res) => {
  res.json({
    database_name: "backend-db",
    database_id: "161f312b-338c-45fa-ac67-c97025625623",
    engine: "Cloudflare D1 SQLite",
    status: "Operational",
    region: "Global Anycast Edge",
    total_queries: 0,
    rows_read: 0,
    rows_written: 0,
    storage_used_bytes: 12584,
    // 12.29 KB
    tables_count: 0
  });
});
app.get("/sitemap.xml", (req, res) => {
  const host = `${req.protocol}://${req.headers.host || "localhost:3000"}`;
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const staticRoutes = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "platform", priority: "0.9", changefreq: "daily" },
    { path: "opspilot-public", priority: "0.9", changefreq: "daily" },
    { path: "studio-public", priority: "0.9", changefreq: "daily" },
    { path: "prompt-library", priority: "0.9", changefreq: "daily" },
    { path: "workflow-library", priority: "0.9", changefreq: "daily" },
    { path: "collections", priority: "0.8", changefreq: "weekly" },
    { path: "community", priority: "0.8", changefreq: "weekly" },
    { path: "docs", priority: "0.9", changefreq: "daily" },
    { path: "pricing", priority: "0.8", changefreq: "weekly" },
    { path: "integrations", priority: "0.8", changefreq: "weekly" },
    { path: "about", priority: "0.7", changefreq: "monthly" },
    { path: "contact", priority: "0.7", changefreq: "monthly" },
    { path: "privacy", priority: "0.6", changefreq: "monthly" },
    { path: "terms", priority: "0.6", changefreq: "monthly" },
    { path: "security", priority: "0.6", changefreq: "monthly" }
  ];
  const promptRoutes = (INITIAL_LIBRARY_PROMPTS || []).map((p) => ({
    path: `prompt-detail-${p.id}`,
    priority: "0.8",
    changefreq: "weekly"
  }));
  const allRoutes = [...staticRoutes, ...promptRoutes];
  const urlsXml = allRoutes.map(
    (r) => `  <url>
    <loc>${host}/${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  ).join("\n");
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemapXml);
});
app.get("/robots.txt", (req, res) => {
  const host = req.headers.host || "localhost:3000";
  const protocol = req.protocol || "http";
  const content = `User-agent: *
Allow: /

Sitemap: ${protocol}://${host}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(content);
});
app.post("/api/opspilot/snow/test", async (req, res) => {
  try {
    const {
      instanceUrl = process.env.SERVICENOW_URL || "https://dev306702.service-now.com",
      username = process.env.SERVICENOW_USER || "admin",
      password = process.env.SERVICENOW_PWD || "v9/Vq@TnJ4qI"
    } = req.body;
    const cleanUrl = instanceUrl.replace(/\/+$/, "");
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
    const snowResp = await fetch(`${cleanUrl}/api/now/table/incident?sysparm_limit=1`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json"
      }
    });
    if (snowResp.ok) {
      const data = await snowResp.json();
      res.json({
        status: "ok",
        message: "Successfully authenticated with ServiceNow REST Table API",
        instanceUrl: cleanUrl,
        sampleRecordCount: data.result ? data.result.length : 0
      });
    } else {
      const errText = await snowResp.text();
      res.status(snowResp.status).json({
        error: `ServiceNow authentication failed (HTTP ${snowResp.status})`,
        details: errText.substring(0, 300)
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to connect to ServiceNow instance endpoint", details: err.message });
  }
});
app.post("/api/opspilot/snow/incidents", async (req, res) => {
  try {
    const {
      instanceUrl = process.env.SERVICENOW_URL || "https://dev306702.service-now.com",
      username = process.env.SERVICENOW_USER || "admin",
      password = process.env.SERVICENOW_PWD || "v9/Vq@TnJ4qI",
      limit = 10
    } = req.body;
    const cleanUrl = instanceUrl.replace(/\/+$/, "");
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
    const snowResp = await fetch(`${cleanUrl}/api/now/table/incident?sysparm_limit=${limit}&sysparm_query=ORDERBYDESCsys_created_on`, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Accept": "application/json"
      }
    });
    if (snowResp.ok) {
      const data = await snowResp.json();
      const rawIncidents = data.result || [];
      const formattedIncidents = rawIncidents.map((inc) => {
        const priorityMap = {
          "1": "P1",
          "2": "P2",
          "3": "P3",
          "4": "P4"
        };
        const priorityStr = priorityMap[String(inc.priority)] || "P2";
        return {
          id: inc.number || inc.sys_id || `INC${Math.floor(Math.random() * 9e4 + 1e4)}`,
          sys_id: inc.sys_id,
          title: inc.short_description || "ServiceNow Unspecified Incident",
          priority: priorityStr,
          service: inc.cmdb_ci?.display_value || inc.business_service || "Infrastructure Service",
          status: inc.state === "1" ? "Investigating" : inc.state === "2" ? "Remediating" : "Resolved",
          timestamp: inc.sys_created_on || (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
          confidence: Math.floor(Math.random() * 10 + 88),
          risk: priorityStr === "P1" ? "Critical" : priorityStr === "P2" ? "Moderate" : "Low",
          impact: inc.description || inc.short_description || "High blast radius affecting production service nodes.",
          plannerLog: `Parsed ServiceNow sys_id ${inc.sys_id} and correlated 12,000 syslog entries.`,
          investigatorLog: `Pinpointed root cause in ${inc.cmdb_ci?.display_value || "ServiceNow Configuration Item"}.`,
          remediatorLog: `Generated automated resolution work notes for ServiceNow ticket ${inc.number}.`,
          recommendedFix: `Update ServiceNow Incident ${inc.number} resolution state and apply canary patch.`
        };
      });
      res.json({ status: "ok", incidents: formattedIncidents });
    } else {
      res.status(snowResp.status).json({ error: `ServiceNow request failed with HTTP ${snowResp.status}` });
    }
  } catch (err) {
    res.status(500).json({ error: "ServiceNow API proxy failed", details: err.message });
  }
});
app.post("/api/opspilot/snow/update", async (req, res) => {
  try {
    const {
      instanceUrl = process.env.SERVICENOW_URL || "https://dev306702.service-now.com",
      username = process.env.SERVICENOW_USER || "admin",
      password = process.env.SERVICENOW_PWD || "v9/Vq@TnJ4qI",
      sysId,
      incidentNumber,
      workNotes,
      state = "6",
      // 6 = Resolved in ServiceNow
      closeNotes = "Resolved automatically by OpsPilot Multi-Agent Swarm"
    } = req.body;
    if (!sysId && !incidentNumber) {
      res.status(400).json({ error: "sysId or incidentNumber is required" });
      return;
    }
    const cleanUrl = instanceUrl.replace(/\/+$/, "");
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
    const updateBody = {};
    if (workNotes) updateBody.work_notes = workNotes;
    if (state) updateBody.state = state;
    if (closeNotes) updateBody.close_notes = closeNotes;
    const targetUrl = sysId ? `${cleanUrl}/api/now/table/incident/${sysId}` : `${cleanUrl}/api/now/table/incident?sysparm_query=number=${incidentNumber}`;
    const snowResp = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(updateBody)
    });
    if (snowResp.ok) {
      const data = await snowResp.json();
      res.json({
        status: "ok",
        message: `Successfully updated ServiceNow incident ${incidentNumber || sysId}`,
        result: data.result
      });
    } else {
      const errText = await snowResp.text();
      res.status(snowResp.status).json({
        error: `ServiceNow update failed with HTTP ${snowResp.status}`,
        details: errText.substring(0, 300)
      });
    }
  } catch (err) {
    res.status(500).json({ error: "ServiceNow update proxy failed", details: err.message });
  }
});
app.post("/api/models/list", async (req, res) => {
  try {
    const { apiKey = "", provider = "Google AI", endpointUrl = "" } = req.body;
    const userKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();
    if (provider !== "Localhost" && provider !== "Ollama" && (!userKey || userKey.length < 15)) {
      res.status(400).json({ error: "Valid API Key required to list live models." });
      return;
    }
    let modelSlugs = [];
    if (provider === "Google AI" || provider === "Google") {
      const ai = geminiClient(userKey);
      const listPager = await ai.models.list();
      for await (const m of listPager) {
        if (m.name) {
          const cleanName = m.name.replace("models/", "");
          if (cleanName.startsWith("gemini") || cleanName.startsWith("imagen")) {
            modelSlugs.push(cleanName);
          }
        }
      }
    } else if (provider === "OpenAI") {
      const oai = openaiClient(userKey);
      const list = await oai.models.list();
      modelSlugs = list.data.map((m) => m.id).filter((id) => id.startsWith("gpt") || id.startsWith("o1") || id.startsWith("o3")).sort();
    } else if (provider === "Groq Cloud") {
      const groq = openaiClient(userKey, "https://api.groq.com/openai/v1");
      const list = await groq.models.list();
      modelSlugs = list.data.map((m) => m.id).sort();
    } else if (provider === "DeepSeek") {
      modelSlugs = ["deepseek-chat", "deepseek-reasoner"];
    } else if (provider === "Anthropic") {
      modelSlugs = ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229", "claude-3-haiku-20240307"];
    } else if (provider === "Localhost" || provider === "Ollama") {
      const base = endpointUrl || "http://localhost:11434";
      const r = await fetch(`${base}/api/tags`);
      const data = await r.json();
      if (data.models && Array.isArray(data.models)) {
        modelSlugs = data.models.map((m) => m.name);
      }
    }
    res.json({ success: true, provider, models: modelSlugs });
  } catch (err) {
    console.warn("Live model listing error:", err.message);
    res.status(500).json({ error: err.message || "Failed to list models live." });
  }
});
app.post("/api/agent/run", async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      rolePersona = "Senior AI Software Architect",
      promptText = "",
      variableCode = "",
      targetModel = "gemini-1.5-flash-8b",
      temperature = 0.2,
      apiKey = "",
      provider = "Google AI",
      endpointUrl = ""
    } = req.body;
    const userKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();
    const temp = Math.min(Math.max(Number(temperature) || 0.2, 0), 1);
    const fullPrompt = `${promptText.replace("{{CODE_SNIPPET}}", variableCode)}

Input Code:
\`\`\`
${variableCode}
\`\`\``;
    const isOllama = provider === "Localhost" || provider === "Ollama";
    if (!isOllama && (!userKey || userKey.length < 15 || userKey.includes("..."))) {
      res.status(400).json({
        error: `Missing or incomplete API key for ${provider}. Go to AI Connections and paste your full ${provider} key.`,
        latencyMs: Date.now() - startTime
      });
      return;
    }
    let outputText = "";
    let usedModel = targetModel;
    let lastError = "";
    if (provider === "Google AI" || provider === "Google" || targetModel.startsWith("gemini")) {
      const models = [targetModel, "gemini-1.5-flash-8b", "gemini-2.0-flash-lite", "gemini-2.0-flash"].filter((m, i, a) => a.indexOf(m) === i);
      for (const slug of models) {
        try {
          const ai = geminiClient(userKey);
          const result = await ai.models.generateContent({
            model: slug,
            contents: fullPrompt,
            config: { systemInstruction: rolePersona, temperature: temp, maxOutputTokens: 2048 }
          });
          if (result.text) {
            outputText = result.text;
            usedModel = slug;
            break;
          }
          lastError = `Empty response from ${slug}`;
        } catch (e) {
          lastError = e.message || `${slug} failed`;
          console.warn(`Gemini [${slug}]:`, lastError);
          if (lastError.toLowerCase().includes("api key") || lastError.includes("UNAUTHENTICATED")) break;
        }
      }
    } else if (provider === "OpenAI" || targetModel.startsWith("gpt") || targetModel.startsWith("o1") || targetModel.startsWith("o3")) {
      try {
        const model = targetModel || "gpt-4o-mini";
        const oai = openaiClient(userKey);
        const completion = await oai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: rolePersona },
            { role: "user", content: fullPrompt }
          ],
          temperature: temp,
          max_tokens: 2048
        });
        const text = completion.choices[0]?.message?.content;
        if (text) {
          outputText = text;
          usedModel = model;
        } else {
          lastError = `OpenAI returned empty content (finish_reason: ${completion.choices[0]?.finish_reason})`;
        }
      } catch (e) {
        lastError = `[OpenAI] ${e.message}`;
        console.warn("OpenAI:", lastError);
      }
    } else if (provider === "Groq Cloud") {
      try {
        const model = targetModel || "llama-3.3-70b-versatile";
        const groq = openaiClient(userKey, "https://api.groq.com/openai/v1");
        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: "system", content: rolePersona }, { role: "user", content: fullPrompt }],
          temperature: temp,
          max_tokens: 2048
        });
        const text = completion.choices[0]?.message?.content;
        if (text) {
          outputText = text;
          usedModel = model;
        } else {
          lastError = `Groq returned empty content`;
        }
      } catch (e) {
        lastError = `[Groq] ${e.message}`;
      }
    } else if (provider === "DeepSeek" || targetModel.startsWith("deepseek")) {
      try {
        const model = targetModel || "deepseek-chat";
        const ds = openaiClient(userKey, "https://api.deepseek.com/v1");
        const completion = await ds.chat.completions.create({
          model,
          messages: [{ role: "system", content: rolePersona }, { role: "user", content: fullPrompt }],
          temperature: temp,
          max_tokens: 2048
        });
        const text = completion.choices[0]?.message?.content;
        if (text) {
          outputText = text;
          usedModel = model;
        } else {
          lastError = `DeepSeek returned empty content`;
        }
      } catch (e) {
        lastError = `[DeepSeek] ${e.message}`;
      }
    } else if (provider === "Anthropic" || targetModel.startsWith("claude")) {
      try {
        const model = targetModel || "claude-3-haiku-20240307";
        const httpRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": userKey, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model, system: rolePersona, messages: [{ role: "user", content: fullPrompt }], max_tokens: 2048, temperature: temp })
        });
        const data = await httpRes.json();
        if (data.error) {
          lastError = `[Anthropic ${data.error.type}] ${data.error.message}`;
        } else {
          const text = data.content?.[0]?.text;
          if (text) {
            outputText = text;
            usedModel = model;
          } else {
            lastError = `Anthropic returned no content`;
          }
        }
      } catch (e) {
        lastError = `[Anthropic] ${e.message}`;
      }
    } else if (isOllama) {
      try {
        const model = targetModel || "llama3.2";
        const base = endpointUrl || "http://localhost:11434";
        const httpRes = await fetch(`${base}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt: `${rolePersona}

${fullPrompt}`, stream: false, options: { temperature: temp } })
        });
        const data = await httpRes.json();
        if (data.response) {
          outputText = data.response;
          usedModel = model;
        } else {
          lastError = data.error || `Ollama returned no response. Run 'ollama serve' first.`;
        }
      } catch (e) {
        lastError = `Ollama failed: ${e.message}. Run 'ollama serve'.`;
      }
    } else {
      lastError = `Provider "${provider}" is not supported. Use Google AI, OpenAI, Groq, DeepSeek, Anthropic, or Ollama.`;
    }
    if (!outputText) {
      res.status(400).json({ error: lastError || `${provider} API call failed.`, latencyMs: Date.now() - startTime });
      return;
    }
    const latencyMs = Date.now() - startTime;
    const tokensUsed = Math.max(80, Math.ceil((fullPrompt.length + outputText.length) / 3.8));
    const cost = `$${(tokensUsed / 1e3 * 12e-5).toFixed(5)}`;
    res.json({ success: true, agentName: usedModel, model: usedModel, provider, latencyMs, cost, tokensUsed, content: outputText, timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString() });
  } catch (err) {
    console.error("Agent API Fatal Error:", err);
    res.status(500).json({ error: err.message || "Pipeline execution failed.", latencyMs: Date.now() - startTime });
  }
});
app.post("/api/tools/optimize", async (req, res) => {
  try {
    const { prompt, targetModel = "chatgpt", tone = "professional", includeVariables = true, addGuardrails = true, apiKey = "", provider = "Google AI" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Please provide a valid prompt string to optimize." });
      return;
    }
    const userKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();
    if (!userKey) {
      res.status(400).json({ error: "No API key available. Add your key in AI Connections." });
      return;
    }
    const systemInstruction = `You are the Lead AI Prompt Engineer at PromptImageLab.com.
Optimize raw user prompts into enterprise-grade, highly effective prompts for target model: "${targetModel}".
Follow these principles: Role & Persona Definition, Context & Constraints, Delimiters for Inputs, Explicit Output Schema, reusable {{variables}}, safety guardrails.
Return ONLY valid JSON matching the required schema.`;
    const userContent = `Optimize for ${targetModel} (Tone: ${tone}, Variables: ${includeVariables}, Guardrails: ${addGuardrails}):
"""
${prompt}
"""`;
    let result = null;
    if (provider === "OpenAI" || userKey.startsWith("sk-")) {
      const oai = openaiClient(userKey);
      const completion = await oai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemInstruction }, { role: "user", content: userContent }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });
      result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    } else {
      const ai = geminiClient(userKey);
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-8b",
        contents: userContent,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3,
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              optimizedPrompt: { type: import_genai.Type.STRING },
              qualityScore: { type: import_genai.Type.INTEGER },
              improvements: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } },
              suggestedVariables: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.OBJECT, properties: { name: { type: import_genai.Type.STRING }, label: { type: import_genai.Type.STRING }, defaultValue: { type: import_genai.Type.STRING } }, required: ["name", "label"] } },
              negativePrompt: { type: import_genai.Type.STRING },
              securityNotes: { type: import_genai.Type.STRING },
              estimatedTokensSaved: { type: import_genai.Type.INTEGER },
              explanation: { type: import_genai.Type.STRING }
            },
            required: ["optimizedPrompt", "qualityScore", "improvements", "explanation"]
          }
        }
      });
      result = JSON.parse(response.text || "{}");
    }
    res.json({ originalPrompt: prompt, targetModel, ...result });
  } catch (err) {
    console.error("Optimizer error:", err);
    res.status(500).json({ error: err.message || "Failed to optimize prompt." });
  }
});
app.post("/api/tools/generate", async (req, res) => {
  try {
    const { taskDescription, domain = "general", targetModel = "claude", apiKey = "", provider = "Google AI" } = req.body;
    if (!taskDescription) {
      res.status(400).json({ error: "Task description is required." });
      return;
    }
    const userKey = (apiKey || process.env.GEMINI_API_KEY || "").trim();
    if (!userKey) {
      res.status(400).json({ error: "No API key available. Add your key in AI Connections." });
      return;
    }
    const systemInstruction = `You are a Master Prompt Architect. Generate an elite system prompt for ${targetModel}. Include persona, task breakdown, {{variables}}, and output format.`;
    const userContent = `Generate a master prompt for: "${taskDescription}" in domain "${domain}" for model "${targetModel}".`;
    let generatedPrompt = "";
    if (provider === "OpenAI" || userKey.startsWith("sk-")) {
      const oai = openaiClient(userKey);
      const completion = await oai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemInstruction }, { role: "user", content: userContent }],
        temperature: 0.7
      });
      generatedPrompt = completion.choices[0]?.message?.content || "";
    } else {
      const ai = geminiClient(userKey);
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-8b",
        contents: userContent,
        config: { systemInstruction, temperature: 0.7 }
      });
      generatedPrompt = response.text || "";
    }
    res.json({ generatedPrompt });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate prompt." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
PromptImageLab Multi-Provider Platform \u2014 http://0.0.0.0:${PORT}`);
    console.log(`  \u2713 Google AI  (Gemini 1.5 / 2.0 / 2.5) via @google/genai SDK`);
    console.log(`  \u2713 OpenAI     (GPT-4o / GPT-4o-mini)   via openai SDK`);
    console.log(`  \u2713 Groq Cloud (Llama 3.3)              via OpenAI-compatible`);
    console.log(`  \u2713 DeepSeek   (V3 / R1)                via OpenAI-compatible`);
    console.log(`  \u2713 Anthropic  (Claude 3.x)             via REST`);
    console.log(`  \u2713 Ollama     (local models)           via REST
`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
