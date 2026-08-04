import { LearnArticle } from '../types';

export interface DocArticleSection {
  id: string;
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  callout?: {
    type: 'note' | 'warning' | 'tip' | 'important';
    text: string;
  };
}

export interface DocArticle {
  id: string;
  slug: string;
  title: string;
  product: 'OpsPilot' | 'Studio' | 'Architecture' | 'Shared Services' | 'API Reference' | 'Enterprise Use Cases';
  category: string;
  description: string;
  readTime: string;
  lastUpdated: string;
  author: string;
  targetAudience: string;
  prerequisites?: string[];
  keywords: string[];
  sections: DocArticleSection[];
  relatedSlugs: string[];
  schemaType: 'TechArticle' | 'HowTo';
}

export const docsDatabase: DocArticle[] = [

  // ─── TUTORIALS ────────────────────────────────────────────────────────────────

  {
    id: 'doc-getting-started',
    slug: 'getting-started-platform',
    title: 'Getting Started: Connect an AI Provider & Run Your First Prompt',
    product: 'Studio',
    category: 'Tutorials',
    description: 'Step-by-step guide to connecting a Google Gemini, OpenAI, or Groq API key and running your first structured prompt in the PromptImageLab Studio playground.',
    readTime: '6 min read',
    lastUpdated: 'January 2026',
    author: 'PromptImageLab Product Team',
    targetAudience: 'New Users, AI Engineers, Developers',
    prerequisites: ['Active PromptImageLab account', 'API key from at least one provider'],
    keywords: ['Getting Started', 'API Setup', 'Gemini', 'OpenAI', 'GPT-4o', 'First Prompt', 'Quickstart'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-create-account',
        title: 'Step 1 — Create Your Workspace',
        content: 'Click "Dashboard / Launch Platform" in the top navigation and sign in with your email. Your workspace is isolated with zero data retention — no prompts or responses are stored server-side.'
      },
      {
        id: 'sec-connect-provider',
        title: 'Step 2 — Connect Your AI Provider',
        content: 'Navigate to Connections and click "Add Provider". Select from Google Gemini, OpenAI, Groq, DeepSeek, Anthropic Claude, or a local Ollama endpoint. Your API key is stored only in your browser session via AES-256 localStorage encryption.',
        codeSnippet: {
          language: 'text',
          caption: 'Supported Providers (as of 2026)',
          code: `Google AI  — Gemini 1.5 Flash / Pro, Gemini 2.0 Flash, Gemini 2.5 Pro\nOpenAI     — GPT-4o, GPT-4o-mini, GPT-4-Turbo\nGroq Cloud — Llama 3.3 70B, Mixtral 8x7B\nDeepSeek   — DeepSeek V3, DeepSeek R1\nAnthropic  — Claude 3.5 Sonnet, Claude 3.5 Haiku\nOllama     — Any local model (llama3, mistral, phi3)`
        }
      },
      {
        id: 'sec-run-first-prompt',
        title: 'Step 3 — Run Your First Prompt',
        content: 'Go to Studio and open the "Prompt Workspace". Select your provider and model. Write a system prompt using the Role-Task-Constraint (RTC) pattern, paste your user message, and click "Run". The response appears alongside token cost estimates for every enabled provider.'
      },
      {
        id: 'sec-next-steps',
        title: 'Step 4 — Next Steps',
        content: 'Browse the Prompt Library to find ready-made engineering prompts for your domain. Explore Workflow Library for multi-step pipelines. If you are an IT Operations team, visit OpsPilot to automate ServiceNow incident triage.'
      }
    ],
    relatedSlugs: ['prompt-engineering-principles', 'servicenow-integration-setup']
  },

  {
    id: 'doc-multi-provider-comparison',
    slug: 'multi-provider-model-comparison-tutorial',
    title: 'Tutorial: Compare GPT-4o vs Gemini 2.5 Pro on the Same Prompt',
    product: 'Studio',
    category: 'Tutorials',
    description: 'Learn to use Studio\'s side-by-side model comparison mode to evaluate GPT-4o, Gemini 2.5, and DeepSeek R1 on a single engineering prompt — with token cost breakdown.',
    readTime: '8 min read',
    lastUpdated: 'January 2026',
    author: 'AI Quality Engineering Team',
    targetAudience: 'Prompt Engineers, AI Engineers, Tech Leads choosing models',
    keywords: ['GPT-4o vs Gemini', 'Model Comparison', 'LLM Benchmark', 'Token Cost', 'DeepSeek R1'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-why-compare',
        title: 'Why Multi-Model Comparison Matters',
        content: 'Different models excel at different tasks. GPT-4o handles complex reasoning well; Gemini 2.5 Pro has a 1M token context window for massive codebases; DeepSeek R1 is cost-effective for repetitive extraction tasks. Comparing all three on your specific prompt prevents costly over-engineering.'
      },
      {
        id: 'sec-launch-comparison',
        title: 'Launching the Comparison Mode',
        content: 'In Studio, click "Multi-Model Compare" in the toolbar. Enable at least two providers. Paste your prompt and click "Run All". Studio sends identical inputs to every enabled model in parallel and displays structured responses side by side.'
      },
      {
        id: 'sec-read-results',
        title: 'Interpreting the Results',
        content: 'Each response card shows: latency (ms), input/output token count, estimated cost per 1M tokens at current provider pricing, and a quality score computed via Studio\'s automated rubric evaluation. Export results as CSV for stakeholder reporting.'
      }
    ],
    relatedSlugs: ['prompt-engineering-principles', 'getting-started-platform']
  },

  // ─── ARCHITECTURE ──────────────────────────────────────────────────────────────

  {
    id: 'doc-agent-orchestration-architecture',
    slug: 'agent-orchestration-dag-architecture',
    title: 'Multi-Agent DAG Orchestration: Architecture & Implementation Guide',
    product: 'Architecture',
    category: 'Architecture',
    description: 'Technical deep-dive into PromptImageLab\'s Directed Acyclic Graph (DAG) orchestration engine. Covers agent node types, dependency resolution, parallel execution, error fallbacks, and human-in-the-loop checkpoints.',
    readTime: '18 min read',
    lastUpdated: 'February 2026',
    author: 'Principal AI Systems Architect',
    targetAudience: 'AI Engineers, ML Platform Engineers, Solutions Architects',
    keywords: ['DAG Orchestration', 'Multi-Agent', 'LangGraph Alternative', 'CrewAI Alternative', 'Parallel Agent Execution', 'HITL'],
    schemaType: 'TechArticle',
    sections: [
      {
        id: 'sec-dag-overview',
        title: 'DAG Execution Model',
        content: 'PromptImageLab\'s orchestration engine treats each agent as a typed graph node with declared input and output schemas. Edges represent data dependencies. The scheduler resolves dependency order at runtime, executing independent agents in parallel across isolated worker threads.',
        codeSnippet: {
          language: 'typescript',
          caption: 'DAG Agent Node Definition',
          code: `const incidentTriageWorkflow = {
  nodes: {
    "parse-logs":    { type: "extractor", inputs: ["raw_logs"], outputs: ["parsed_errors"] },
    "cmdb-lookup":   { type: "retrieval", inputs: ["server_name"], outputs: ["cmdb_record"] },
    "classify":      { type: "llm", inputs: ["parsed_errors", "cmdb_record"], outputs: ["category", "priority"] },
    "update-ticket": { type: "action",   inputs: ["category", "priority", "sys_id"], outputs: ["update_status"] }
  },
  edges: [
    { from: "parse-logs",  to: "classify" },
    { from: "cmdb-lookup", to: "classify" },
    { from: "classify",    to: "update-ticket" }
  ]
};`
        }
      },
      {
        id: 'sec-parallel-execution',
        title: 'Parallel Execution & Performance',
        content: 'When two nodes have no shared dependencies, they execute in parallel. In the example above, "parse-logs" and "cmdb-lookup" run simultaneously, reducing total workflow latency by up to 60% vs sequential chaining. Each node timeout is configurable independently to prevent bottlenecks.'
      },
      {
        id: 'sec-hitl',
        title: 'Human-in-the-Loop (HITL) Checkpoints',
        content: 'Insert a HITL node at any point in the DAG. When reached, the workflow pauses and sends a Slack or Teams notification to a designated reviewer. The reviewer approves or modifies the intermediate output, and execution resumes from that node.'
      },
      {
        id: 'sec-error-handling',
        title: 'Error Fallbacks & Retry Policies',
        content: 'Each node declares a fallback strategy: RETRY (up to N times with exponential backoff), SKIP (log and continue with null output), ABORT (halt entire workflow and notify), or SUBSTITUTE (use a lighter model if primary fails). This prevents full pipeline failure from transient provider errors.'
      }
    ],
    relatedSlugs: ['servicenow-integration-setup', 'use-case-it-operations-servicenow']
  },

  {
    id: 'doc-security-architecture',
    slug: 'security-zero-retention-architecture',
    title: 'Security Architecture: Zero Data Retention & Enterprise API Key Isolation',
    product: 'Architecture',
    category: 'Architecture',
    description: 'Full security model specification: how PromptImageLab achieves zero server-side data retention, AES-256 API key encryption, SOC 2 Type II readiness, and prompt injection defense layers.',
    readTime: '10 min read',
    lastUpdated: 'January 2026',
    author: 'Chief Information Security Architect',
    targetAudience: 'CISOs, Security Engineers, Enterprise IT Governance Teams',
    keywords: ['Zero Data Retention', 'AES-256', 'SOC 2', 'Prompt Injection', 'API Key Security', 'Enterprise Security'],
    schemaType: 'TechArticle',
    sections: [
      {
        id: 'sec-zero-retention',
        title: 'Zero Server-Side Data Retention',
        content: 'No prompt text, AI model responses, or user-submitted content is stored on PromptImageLab servers. All inference calls are proxied directly from the client to the provider\'s API. Server logs contain only anonymized rate-limiting metadata with a 24-hour rolling TTL.'
      },
      {
        id: 'sec-api-key-storage',
        title: 'Client-Side API Key Encryption',
        content: 'API keys provided by users are encrypted using AES-256-GCM with a per-session derived key before storage in localStorage. Keys are never transmitted to PromptImageLab servers. On browser close, the session key is destroyed and the encrypted blob cannot be decrypted without the original session.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Key Encryption Pattern (simplified)',
          code: `// Derived per-session via PBKDF2 with random salt
const sessionKey = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
  baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
);`
        }
      },
      {
        id: 'sec-injection-defense',
        title: 'Prompt Injection Defense Layers',
        content: 'Studio\'s Prompt Evaluator runs a three-layer injection scan: (1) Static pattern matching against known injection payloads, (2) LLM-as-judge evaluation of whether the system prompt maintains boundary integrity after appending user input, and (3) XML/JSON output validation to detect schema-violating responses that indicate successful injection.'
      }
    ],
    relatedSlugs: ['agent-orchestration-dag-architecture', 'prompt-engineering-principles']
  },

  // ─── INTEGRATIONS ──────────────────────────────────────────────────────────────

  {
    id: 'doc-servicenow-integration-setup',
    slug: 'servicenow-integration-setup',
    title: 'ServiceNow ITSM REST & MID Server Integration Architecture',
    product: 'OpsPilot',
    category: 'Integrations',
    description: 'Complete step-by-step technical setup for binding OpsPilot to ServiceNow. Covers REST table API endpoints, OAuth2 token configuration, MID server proxying, and incident webhooks.',
    readTime: '12 min read',
    lastUpdated: 'February 2026',
    author: 'Enterprise SRE Architect',
    targetAudience: 'ServiceNow System Administrators, SRE Leads, IT Operations Directors',
    keywords: ['ServiceNow REST API', 'GlideRecord', 'MID Server', 'Incident Webhooks', 'OAuth2'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-overview',
        title: 'Architecture Overview & Authentication Scopes',
        content: 'PromptImageLab OpsPilot connects to ServiceNow via standard Table REST APIs (api/now/table/incident) or private MID Server endpoints. OAuth2.0 Client Credentials or Basic Auth with Service Accounts are both supported. For on-premise ServiceNow instances, the MID Server acts as a secure outbound proxy.'
      },
      {
        id: 'sec-rest-api-setup',
        title: 'Configuring the Table API Connection',
        content: 'In ServiceNow, create a Service Account (non-interactive user) with the "rest_api_explorer" and "itil" roles. Generate OAuth2 credentials from System OAuth → Application Registry. Paste the client_id and client_secret into OpsPilot Connections.',
        codeSnippet: {
          language: 'typescript',
          caption: 'ServiceNow REST API Payload Construction',
          code: `const servicenowPayload = {
  short_description: "Billing API timeout",
  category: "Software",
  subcategory: "Database",
  assignment_group: "Tier-2 SRE Infrastructure",
  work_notes: "Auto-analyzed by OpsPilot. Root cause: Redis pool exhaustion."
};

const response = await fetch(
  "https://your-instance.service-now.com/api/now/table/incident",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${accessToken}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(servicenowPayload)
  }
);`
        }
      },
      {
        id: 'sec-webhook-config',
        title: 'Configuring Incident Creation Webhooks',
        content: 'In ServiceNow, create a Business Rule or REST Message trigger to POST to the OpsPilot webhook endpoint on incident creation. OpsPilot processes the payload asynchronously — typical analysis latency is under 8 seconds for standard incident descriptions with attached log text.'
      },
      {
        id: 'sec-mid-server',
        title: 'MID Server Proxying for On-Premise Instances',
        content: 'For ServiceNow instances behind corporate firewalls, deploy the PromptImageLab MID Server Agent alongside your existing ServiceNow MID Server. The agent registers as an ECC Queue consumer and routes OpsPilot API calls through the secure MID Server tunnel without opening inbound firewall rules.'
      }
    ],
    relatedSlugs: ['agent-orchestration-dag-architecture', 'use-case-it-operations-servicenow']
  },

  {
    id: 'doc-github-actions-integration',
    slug: 'github-actions-studio-integration',
    title: 'GitHub Actions Integration: Automated PR Security & Code Quality Audits',
    product: 'Studio',
    category: 'Integrations',
    description: 'Configure Studio\'s GitHub Action to automatically audit every pull request for OWASP vulnerabilities, Big-O complexity regressions, SQL injection patterns, and hardcoded API keys.',
    readTime: '9 min read',
    lastUpdated: 'January 2026',
    author: 'DevSecOps Architecture Team',
    targetAudience: 'DevOps Engineers, Tech Leads, Security Engineers',
    keywords: ['GitHub Actions', 'PR Audit', 'OWASP', 'Code Quality', 'CI/CD Security', 'DevSecOps'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-action-setup',
        title: 'Adding the Studio Action to Your Workflow',
        content: 'Install the PromptImageLab GitHub App from the GitHub Marketplace. Generate an API key in Studio → Connections → GitHub. Add the API key as a repository secret named PROMPT_LAB_KEY.',
        codeSnippet: {
          language: 'yaml',
          caption: '.github/workflows/code-audit.yml',
          code: `name: PromptImageLab Code Audit
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for diff analysis

      - name: PromptImageLab Security & Quality Audit
        uses: promptimagelab/action-audit@v2
        with:
          api_key: \${{ secrets.PROMPT_LAB_KEY }}
          fail_on_critical: true
          checks: "owasp,complexity,secrets,sql-injection"
          post_inline_comments: true`
        }
      },
      {
        id: 'sec-audit-output',
        title: 'Understanding Audit Output',
        content: 'Studio posts inline PR review comments at the exact diff lines where issues are detected. Each comment includes: severity (CRITICAL/HIGH/MEDIUM/LOW), CWE reference number, a plain-English explanation of the vulnerability, and a suggested safe refactoring. Critical findings block the PR from merging.'
      }
    ],
    relatedSlugs: ['use-case-developers-code-audit', 'security-zero-retention-architecture']
  },

  // ─── ENTERPRISE USE CASES ─────────────────────────────────────────────────────

  {
    id: 'doc-use-case-it-ops',
    slug: 'use-case-it-operations-servicenow',
    title: 'Enterprise Guide: Automating ServiceNow Incident Triage for IT Operations Teams',
    product: 'Enterprise Use Cases',
    category: 'IT Operations',
    description: 'An in-depth operational walkthrough showing how IT Service Desk leads and SRE squads use OpsPilot to automate ticket tagging, CMDB correlation, work notes generation, and P1/P2 escalation — with measured MTTR impact data.',
    readTime: '14 min read',
    lastUpdated: 'February 2026',
    author: 'Head of IT Operations Engineering',
    targetAudience: 'IT Operations Directors, ServiceNow System Admins, SRE Squad Leads',
    keywords: ['ServiceNow Incident Triage', 'MTTR Reduction', 'OpsPilot ITSM', 'ITIL Automation', 'CMDB Telemetry'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-problem-overview',
        title: 'The Operational Challenge',
        content: 'Service Desk agents waste up to 40% of their shift manually reading vague incident descriptions (e.g. "Checkout page failing"), guessing assignment groups, and misclassifying ITIL categories. This increases Mean Time to Resolution (MTTR) and breaches customer SLAs. On high-volume P3/P4 ticket queues (200+ tickets/day), manual triage is completely unsustainable.'
      },
      {
        id: 'sec-opspilot-workflow',
        title: 'The OpsPilot Solution Architecture',
        content: 'OpsPilot binds to ServiceNow incident webhooks. On ticket creation, it automatically parses attached server logs, queries CMDB dependencies via GlideRecord REST APIs, sets exact category/subcategory values, and drafts technical work notes for tier-2 dispatch. The entire enrichment cycle completes in under 8 seconds.',
        codeSnippet: {
          language: 'json',
          caption: 'OpsPilot Automated Ticket Enrichment Payload',
          code: `{
  "sys_id": "inc0010948",
  "category": "Database",
  "subcategory": "Connection Timeout",
  "assignment_group": "Database Reliability Engineering",
  "priority": "2",
  "work_notes": "[OpsPilot Analysis]: Stack trace reveals Redis pool starvation on prod-billing-db-01. CMDB confirms this server hosts the Billing microservice for 3 downstream APIs. Suggested action: Flush dead Redis connections. Escalate to DRE on-call if pool exhaustion recurs within 15 minutes."
}`
        }
      },
      {
        id: 'sec-cmdb-correlation',
        title: 'Automatic CMDB Dependency Correlation',
        content: 'OpsPilot queries the ServiceNow CMDB GlideRecord API to identify which business services, applications, and downstream dependencies are affected by the failing CI. This context is injected into the AI prompt so work notes reflect actual infrastructure topology rather than generic advice.'
      },
      {
        id: 'sec-measured-impact',
        title: 'Measured Operational Impact',
        content: 'Teams using OpsPilot report: 58% reduction in Mean Time to Resolution (MTTR), 100% standardized ITIL category/subcategory compliance (eliminating "Other" catches), full elimination of manual triage for P3/P4 tickets, and 23% reduction in tier-2 escalation rate due to better initial routing.'
      }
    ],
    relatedSlugs: ['servicenow-integration-setup', 'use-case-developers-code-audit']
  },

  {
    id: 'doc-use-case-developers',
    slug: 'use-case-developers-code-audit',
    title: 'Enterprise Guide: How Software Engineering Teams Automate Pull Request Reviews',
    product: 'Enterprise Use Cases',
    category: 'Software Engineering',
    description: 'How development teams use Studio\'s GitHub CI/CD integration to automatically scan PR diffs for OWASP Top 10 vulnerabilities, Big-O bottlenecks, AsyncIO refactoring needs, and hardcoded secrets — before human review.',
    readTime: '11 min read',
    lastUpdated: 'February 2026',
    author: 'Principal Software Architect',
    targetAudience: 'Full-Stack Developers, SREs, Security Engineers, Tech Leads',
    keywords: ['GitHub Actions', 'Code Review', 'OWASP Audit', 'AsyncIO Refactoring', 'Pull Request Velocity'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-pr-bottleneck',
        title: 'The Engineering Velocity Bottleneck',
        content: 'Senior engineers spend 3–5 hours per week on pull request reviews — manually hunting for memory leaks, unhandled promise rejections, SQL injection vectors, and hardcoded API keys. This delays sprint delivery and creates security exposure windows when critical PRs queue up behind the review backlog.'
      },
      {
        id: 'sec-studio-audit',
        title: 'Automated GitHub PR Audit Pipeline',
        content: 'Studio ingests the PR diff patch during GitHub Action execution, applies OWASP Top 10 vulnerability scanning, evaluates Big-O complexity deltas, checks for async/await correctness, and posts sanitized inline review comments directly to the pull request — before any human reviewer opens the PR.',
        codeSnippet: {
          language: 'yaml',
          caption: 'GitHub Action — Studio PR Audit Integration',
          code: `- name: PromptImageLab Security Audit
  uses: promptimagelab/action-audit@v2
  with:
    api_key: \${{ secrets.PROMPT_LAB_KEY }}
    fail_on_critical: true
    checks: "owasp,complexity,secrets,sql-injection,async-correctness"`
        }
      },
      {
        id: 'sec-audit-capabilities',
        title: 'What the Audit Detects',
        content: 'The PR audit pipeline covers: OWASP Top 10 (injections, XSS, IDOR, SSRF), hardcoded API keys and tokens (regex + entropy analysis), SQL queries missing parameterization, unhandled promise rejections and missing error boundaries, N+1 query patterns, synchronous operations inside async contexts, and Big-O complexity regressions (e.g. O(n) → O(n²)).'
      },
      {
        id: 'sec-measured-impact-devs',
        title: 'Engineering Velocity Improvements',
        content: 'Teams adopting Studio PR audits report: 4× faster PR review velocity for standard changes, 100% detection of hardcoded API key commits before merge, detection of Big-O regressions 100% of the time (vs. ~30% in manual review), and zero-source-code-retention — the audit runs entirely in memory with no storage of reviewed code.'
      }
    ],
    relatedSlugs: ['use-case-it-operations-servicenow', 'github-actions-studio-integration']
  },

  {
    id: 'doc-use-case-ai-engineers',
    slug: 'use-case-ai-engineers-prompt-lifecycle',
    title: 'Enterprise Guide: Managing Prompt Lifecycle & Token Cost Governance for AI Engineers',
    product: 'Enterprise Use Cases',
    category: 'AI Engineering',
    description: 'How AI engineering teams use Studio to manage the full prompt lifecycle: versioning, multi-model cost comparison, guardrail enforcement, prompt injection scanning, and output schema validation across GPT-4o, Gemini 2.5, and DeepSeek.',
    readTime: '13 min read',
    lastUpdated: 'February 2026',
    author: 'Principal AI Platform Architect',
    targetAudience: 'AI Engineers, Prompt Engineers, ML Platform Teams, AI Product Managers',
    keywords: ['Prompt Lifecycle', 'Token Cost', 'Guardrails', 'Prompt Injection', 'Multi-Model', 'AI Governance'],
    schemaType: 'HowTo',
    sections: [
      {
        id: 'sec-lifecycle-challenge',
        title: 'The Prompt Lifecycle Problem',
        content: 'Production AI prompts degrade silently when underlying LLMs update. Token costs spike when teams use GPT-4o for tasks that DeepSeek R1 handles equally well at 1/10th the cost. Hallucinated outputs surface in production because prompts lack output validation schema. AI engineers need systematic tooling — not manual copy-paste workflows.'
      },
      {
        id: 'sec-version-management',
        title: 'Structured Prompt Versioning',
        content: 'Studio tracks every prompt edit as an immutable version. Each version stores: model parameters, system prompt text, variable schema, expected output format, and evaluation rubric. Teams can A/B test v1 vs v2 on identical inputs and diff the outputs before promoting to production.'
      },
      {
        id: 'sec-cost-governance',
        title: 'Token Cost Governance Across Providers',
        content: 'Studio\'s Cost Calculator runs every prompt against all configured providers simultaneously and returns: latency (P50/P95), input tokens, output tokens, and cost per 1,000 runs. This enables data-driven model selection rather than defaulting to the most expensive option.',
        codeSnippet: {
          language: 'json',
          caption: 'Multi-Provider Cost Comparison Output',
          code: `{
  "prompt_id": "sql-explain-analyzer-v3",
  "results": [
    { "provider": "GPT-4o",       "latency_ms": 1840, "cost_per_1k": "$2.40" },
    { "provider": "Gemini 2.0",   "latency_ms": 950,  "cost_per_1k": "$0.38" },
    { "provider": "DeepSeek V3",  "latency_ms": 1120, "cost_per_1k": "$0.14" },
    { "provider": "Groq Llama 3", "latency_ms": 380,  "cost_per_1k": "$0.06" }
  ],
  "recommendation": "Groq Llama 3.3 — 95% cost savings, latency within SLA"
}`
        }
      },
      {
        id: 'sec-guardrails',
        title: 'Guardrail Enforcement & Output Validation',
        content: 'Attach a JSON Schema or Pydantic model specification to any prompt. Studio\'s output validator checks every model response against the schema before returning it to the caller. Invalid responses trigger automatic retry with explicit correction instructions rather than surfacing malformed data to downstream systems.'
      }
    ],
    relatedSlugs: ['prompt-engineering-principles', 'agent-orchestration-dag-architecture']
  },

  // ─── BEST PRACTICES ────────────────────────────────────────────────────────────

  {
    id: 'doc-prompt-engineering-principles',
    slug: 'prompt-engineering-principles',
    title: 'Enterprise Prompt Engineering: Role-Task-Constraint Framework & Guardrail Standards',
    product: 'Studio',
    category: 'Best Practices',
    description: 'Master deterministic prompt design using the Role-Task-Constraint (RTC) framework, XML boundary delimiters, zero-shot structured JSON extraction, and multi-layer prompt injection mitigation.',
    readTime: '10 min read',
    lastUpdated: 'February 2026',
    author: 'Principal AI Architect',
    targetAudience: 'Prompt Engineers, AI Software Engineers, Security Leads',
    keywords: ['Role-Prompting', 'XML Delimiters', 'JSON Schema', 'Guardrails', 'Injection Prevention', 'RTC Framework'],
    schemaType: 'TechArticle',
    sections: [
      {
        id: 'sec-rtc-framework',
        title: 'The Role-Task-Constraint (RTC) System Prompt Structure',
        content: 'Structure every production system prompt with three explicit XML-delimited sections: <role> defines the model\'s identity and expertise domain, <task> describes the exact output required with format specification, and <constraints> lists absolute prohibitions. This structure prevents prompt drift and makes injection attacks significantly harder.',
        codeSnippet: {
          language: 'xml',
          caption: 'RTC System Prompt Template',
          code: `<role>
You are an expert ServiceNow ITSM analyst specializing in ITIL v4 incident classification.
You have deep knowledge of enterprise infrastructure, CMDB dependencies, and SLA management.
</role>

<task>
Analyze the incident description and attached log content.
Return a structured JSON object with: category, subcategory, priority, assignment_group, and work_notes.
work_notes must be technical, specific, and actionable for a tier-2 engineer.
</task>

<constraints>
NEVER invent CMDB configuration items not present in the provided context.
NEVER set priority below P3 without explicit performance metric evidence.
ALWAYS return valid JSON. Never return prose outside the JSON structure.
</constraints>`
        }
      },
      {
        id: 'sec-xml-delimiters',
        title: 'Why XML Delimiters Prevent Injection',
        content: 'Attackers attempt prompt injection by embedding system-instruction-like text inside user inputs (e.g. "Ignore previous instructions and..."). XML-delimited prompts create syntactic boundaries that the model\'s instruction-following training respects. When user input is clearly placed inside a <user_input> tag separate from the <task> definition, instruction-boundary integrity is maintained.'
      },
      {
        id: 'sec-output-contracts',
        title: 'Output Schema Contracts for Production Reliability',
        content: 'Define explicit JSON Schema or TypeScript interface contracts for every production prompt. The model is told in the <task> section exactly what schema to return. Studio validates responses against the schema and retries with correction instructions on failure. This eliminates unstructured prose responses reaching downstream systems.'
      },
      {
        id: 'sec-evaluation-rubrics',
        title: 'LLM-as-Judge Evaluation Rubrics',
        content: 'Before promoting a prompt to production, configure an automated LLM-as-Judge evaluation. A separate evaluator model (typically a stronger model like Gemini 2.5 Pro) scores the primary model\'s outputs on: accuracy, schema compliance, hallucination absence, and constraint adherence. Results are logged to the prompt\'s version history for traceability.'
      }
    ],
    relatedSlugs: ['agent-orchestration-dag-architecture', 'security-zero-retention-architecture']
  },

  // ─── API REFERENCE ─────────────────────────────────────────────────────────────

  {
    id: 'doc-api-reference',
    slug: 'api-reference-rest-endpoints',
    title: 'REST API Reference: Studio Inference & OpsPilot Webhook Endpoints',
    product: 'API Reference',
    category: 'API Reference',
    description: 'Complete REST API reference for programmatic access to Studio inference, prompt version management, workflow execution, and OpsPilot webhook ingestion endpoints.',
    readTime: '15 min read',
    lastUpdated: 'February 2026',
    author: 'API Platform Engineering Team',
    targetAudience: 'Backend Engineers, Integration Developers, DevOps Teams',
    keywords: ['REST API', 'Webhook', 'Inference API', 'Workflow API', 'API Key', 'OpenAPI'],
    schemaType: 'TechArticle',
    sections: [
      {
        id: 'sec-authentication',
        title: 'Authentication: Bearer Token & API Key Headers',
        content: 'All API requests require a Bearer token issued from Studio → API Keys. Tokens are scoped to read-only (inference), read-write (prompt management), or admin (organization management) permission levels.',
        codeSnippet: {
          language: 'bash',
          caption: 'Authentication Header',
          code: `curl https://api.promptimagelab.com/v1/inference \
  -H "Authorization: Bearer plab_sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"prompt_id": "servicenow-triage-v3", "variables": {"incident_text": "DB timeout on billing API"}}'`
        }
      },
      {
        id: 'sec-inference-endpoint',
        title: 'POST /v1/inference — Run a Stored Prompt',
        content: 'Executes a stored, versioned prompt from your library against any configured provider. Supports variable substitution, model override, and streaming responses. Returns the model output plus token usage and cost metadata.',
        codeSnippet: {
          language: 'json',
          caption: 'Inference Response Schema',
          code: `{
  "request_id": "req_abc123",
  "output": { "category": "Database", "priority": "2", "work_notes": "..." },
  "usage": { "input_tokens": 842, "output_tokens": 156, "latency_ms": 1240 },
  "cost": { "usd": "0.0031", "provider": "gemini-2.0-flash" }
}`
        }
      },
      {
        id: 'sec-opspilot-webhook',
        title: 'POST /v1/opspilot/webhook — Incident Ingestion',
        content: 'OpsPilot\'s inbound webhook endpoint accepts ServiceNow incident payloads and triggers asynchronous AI triage. Returns a 202 Accepted immediately. The enriched incident is patched back to ServiceNow within 8 seconds via the configured REST connection.'
      }
    ],
    relatedSlugs: ['servicenow-integration-setup', 'github-actions-studio-integration']
  }
];

export function getArticleBySlug(slug: string): DocArticle | undefined {
  return docsDatabase.find(doc => doc.slug === slug);
}

export const DOCS_ARTICLES: LearnArticle[] = [
  {
    id: 'doc-getting-started',
    title: 'Getting Started with PromptImageLab Enterprise Platform',
    slug: 'getting-started-platform',
    category: 'Prompt Engineering',
    summary: 'A complete quick-start guide to setting up your workspace, connecting API keys, optimizing prompts, and deploying multi-agent workflows.',
    readTime: '6 min read',
    date: '2026-02-01',
    author: 'PromptImageLab Core Architecture Team',
    tags: ['Getting Started', 'Quickstart', 'Platform Guide', 'API Setup'],
    content: 'Comprehensive quickstart guide.'
  }
];
