import { ComparisonItem, IntegrationItem, UseCaseItem } from '../types';

export const USE_CASES_DATA: UseCaseItem[] = [
  {
    id: 'uc-it-operations',
    slug: 'it-operations-servicenow-automation',
    title: 'IT Operations & Incident Management',
    persona: 'IT Operations',
    headline: 'Automate Incident Triage, Ticket Tagging & Root Cause Diagnostics',
    problem: 'Service Desk agents waste hours manually reading vague incident tickets, leading to high MTTR and missed SLA windows.',
    solution: 'PromptImageLab OpsPilot connects to ServiceNow, ingests incident webhooks, automatically parses log attachments, tags CMDB items, and posts technical work notes.',
    keyBenefits: [
      '58% reduction in Mean Time to Resolution (MTTR).',
      'Automated ITIL taxonomy field mapping.',
      'Zero manual triage overhead for high-volume P3/P4 tickets.',
      'Native ServiceNow REST and MID server support.'
    ],
    recommendedPrompts: ['pr-servicenow-incident', 'pr-6'],
    recommendedWorkflows: ['wf-servicenow-triage', 'wf-rca-postmortem'],
    metricImpact: '58% Faster Incident MTTR'
  },
  {
    id: 'uc-developers',
    slug: 'developers-code-review-optimization',
    title: 'Developers, SREs & Software Engineers',
    persona: 'Developers',
    headline: 'Zero-Hallucination Code Reviews, SQL Optimization & Async Refactoring',
    problem: 'Pull requests clog engineering sprint velocity, while subtle security bugs and memory leaks slip past manual reviews into production.',
    solution: 'Studio provides automated GitHub PR code reviews, OWASP vulnerability scanning, SQL EXPLAIN analyzer tools, and AsyncIO refactoring suites.',
    keyBenefits: [
      '100% Pull Request security audit coverage.',
      'Detection of hardcoded API keys and OWASP vulnerabilities before merge.',
      'Automated Big-O complexity analysis and unit test code generation.',
      'Zero source code retention for strict data privacy.'
    ],
    recommendedPrompts: ['pr-1', 'pr-python-async-refactor', 'pr-sql-query-optimizer'],
    recommendedWorkflows: ['wf-code-security-audit'],
    metricImpact: '4x Faster PR Review Velocity'
  },
  {
    id: 'uc-ai-engineers',
    slug: 'ai-engineers-prompt-lifecycle-guardrails',
    title: 'AI Engineers & Prompt Architects',
    persona: 'AI Engineers',
    headline: 'Enterprise Prompt Lifecycle, Multi-Agent Orchestration & Token Cost Control',
    problem: 'AI prompts break in production when underlying LLMs update, costing thousands in unoptimized token usage and hallucinated outputs.',
    solution: 'Studio provides multi-model prompt optimization, guardrail safety audits, token budget estimation, and MCP agent orchestration.',
    keyBenefits: [
      'Automated role-prompting and XML variable boundary injection.',
      'Security audit scanner detecting prompt injection and exfiltration attacks.',
      'Token cost calculator across GPT-4o, Claude 3.5, Gemini, and DeepSeek.',
      'Strict JSON schema validation and zero-shot output enforcement.'
    ],
    recommendedPrompts: ['pr-5', 'pr-react-custom-hook'],
    recommendedWorkflows: ['wf-code-security-audit'],
    metricImpact: '42% Lower Token API Costs'
  }
];

export const COMPARISONS_DATA: ComparisonItem[] = [
  {
    id: 'comp-langsmith',
    slug: 'promptimagelab-vs-langsmith',
    title: 'PromptImageLab vs. LangSmith',
    competitor: 'LangSmith',
    summary: 'While LangSmith focuses primarily on tracing Python/JS LangChain code execution, PromptImageLab provides a complete enterprise AI Operations platform (OpsPilot) with native ServiceNow integration, prompt lifecycle optimization, and multi-agent workflow management.',
    promptImageLabStrengths: [
      'Native ServiceNow ITSM Incident Management Integration.',
      'Built-in Multi-Agent Visual Workflow Builder.',
      'Integrated Security Guardrails & OWASP Vulnerability Auditor.',
      'Problem-centric Prompt & Workflow Libraries.'
    ],
    competitorStrengths: [
      'Deep Python/TypeScript LangChain tracing SDK.',
      'Established developer community for LangChain users.'
    ],
    featureMatrix: [
      { feature: 'ServiceNow ITSM Integration', promptImageLab: 'Native REST & MID Server', competitor: 'Custom Code Required' },
      { feature: 'Multi-Agent Operations (OpsPilot)', promptImageLab: 'Included out of the box', competitor: 'Tracing only' },
      { feature: 'Prompt Security & Injection Scanner', promptImageLab: 'Automated 5-point audit', competitor: 'Basic evaluation' },
      { feature: 'Token Cost Optimization Engine', promptImageLab: 'Interactive multi-model', competitor: 'Token count logging' }
    ],
    verdict: 'Choose PromptImageLab if you need an enterprise-ready AI engineering platform with native OpsPilot ServiceNow integrations and prompt engineering lifecycle tools. Choose LangSmith if you only need Python code tracing for simple LangChain scripts.',
    bestForPromptImageLab: 'Enterprise IT Operations, SRE Teams, and AI Product Engineers seeking operational automation.',
    bestForCompetitor: 'Python developers debugging raw LangChain code traces.'
  },
  {
    id: 'comp-promptlayer',
    slug: 'promptimagelab-vs-promptlayer',
    title: 'PromptImageLab vs. PromptLayer',
    competitor: 'PromptLayer',
    summary: 'PromptLayer offers basic prompt registry logging. PromptImageLab delivers a comprehensive platform featuring OpsPilot enterprise AI operations, multi-agent workflow chains, structured guardrails, and problem-domain prompt libraries.',
    promptImageLabStrengths: [
      'End-to-end AI Operations (OpsPilot + Studio).',
      'Structured 5-step prompt optimization engine.',
      'Native enterprise integrations (ServiceNow, Jira, Slack).'
    ],
    competitorStrengths: [
      'Simple API proxy middleware for basic prompt logging.'
    ],
    featureMatrix: [
      { feature: 'Enterprise AI Operations', promptImageLab: 'Full OpsPilot Suite', competitor: 'Not Available' },
      { feature: 'Multi-Step Workflow Library', promptImageLab: 'Pre-built business flows', competitor: 'Single prompt registry' },
      { feature: 'OWASP Security Scanner', promptImageLab: 'Included', competitor: 'Not Available' }
    ],
    verdict: 'PromptImageLab provides significantly greater depth, security controls, and enterprise utility than basic prompt logging middleware.',
    bestForPromptImageLab: 'Enterprise engineering teams and AI architects.',
    bestForCompetitor: 'Solo developers seeking a basic prompt proxy.'
  }
];

export const INTEGRATIONS_DATA: IntegrationItem[] = [
  {
    id: 'int-servicenow',
    slug: 'servicenow-integration',
    name: 'ServiceNow ITSM',
    category: 'ITSM',
    status: 'active',
    description: 'Native REST API & MID Server connector for automated incident triage, CMDB item lookup, work notes update, and ticket field classification.',
    keyFeatures: [
      'Direct GlideRecord REST API integration.',
      'MID Server proxy support for restricted on-premise VPCs.',
      'Real-time incident webhook listener.',
      'Automated ITIL field mapping (Category, Priority, Assignment Group).'
    ],
    logoIcon: 'Network'
  },
  {
    id: 'int-github',
    slug: 'github-actions-integration',
    name: 'GitHub & GitHub Actions',
    category: 'Code Repository',
    status: 'active',
    description: 'Automated pull request code review workflow. Scans incoming git diffs for OWASP security vulnerabilities and posts inline PR review suggestions.',
    keyFeatures: [
      'GitHub Webhook & Action workflow trigger.',
      'Inline PR diff code review comments.',
      'Zero code retention for maximum data privacy.'
    ],
    logoIcon: 'GitBranch'
  },
  {
    id: 'int-jira',
    slug: 'jira-software-integration',
    name: 'Jira Software & Atlassian',
    category: 'DevOps',
    status: 'active',
    description: 'Automatically creates Jira tickets for SRE post-mortem action items and security remediation tasks generated by OpsPilot.',
    keyFeatures: [
      'Automated issue creation with P0/P1 priority tags.',
      'Bi-directional status synchronization.'
    ],
    logoIcon: 'CheckSquare'
  },
  {
    id: 'int-azure-devops',
    slug: 'azure-devops-integration',
    name: 'Azure DevOps',
    category: 'DevOps',
    status: 'coming_soon',
    description: 'Deep integration with Azure Pipelines and Boards for automated work item creation and deployment status checks.',
    keyFeatures: ['Azure Pipelines step runner', 'Work Item tracking integration'],
    logoIcon: 'Cloud'
  },
  {
    id: 'int-slack',
    slug: 'slack-integration',
    name: 'Slack & Microsoft Teams',
    category: 'Collaboration',
    status: 'active',
    description: 'Sends real-time incident notifications, post-mortem retrospectives, and approval requests to Slack & Teams channels.',
    keyFeatures: ['Interactive Slack Bot commands', 'Channel alert dispatch'],
    logoIcon: 'MessageSquare'
  }
];
