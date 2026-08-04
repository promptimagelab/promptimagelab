import { WorkflowItem } from '../types';

export const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-servicenow-triage',
    title: 'ServiceNow Incident Automated Triage, Classification & Escalation Chain',
    slug: 'servicenow-automated-incident-triage',
    description: 'An enterprise multi-agent pipeline that ingests unclassified ServiceNow tickets, parses log traces, assigns ITIL categories, and generates SLA escalation triggers.',
    category: 'ServiceNow Operations',
    problemSolved: 'Eliminates manual IT service desk ticket processing delay, reducing MTTR (Mean Time to Resolution) by 58%.',
    businessOverview: 'When infrastructure disruptions occur, ServiceNow receiving hundreds of vague tickets delays incident containment. This workflow automates parsing, categorizing, and routing tickets to exact engineering teams.',
    architectureDiagram: `[Unclassified Ticket] ──> (Ingestion Agent) ──> (Log Diagnostics Agent) ──> (ITIL Classifier Agent) ──> [Updated ServiceNow Record]`,
    stepByStepProcess: [
      'Parse incoming ServiceNow webhook JSON payload containing ticket short description and raw log attachments.',
      'Execute diagnostics agent prompt to scan for server IP, database error code, or stack trace.',
      'Execute ITIL classification prompt to set category, subcategory, impact, urgency, and assignment group.',
      'Generate automated initial work notes update and trigger Slack/Teams alert for P1/P2 tickets.'
    ],
    agentInteractions: [
      'Ingestor Agent -> Diagnostics Agent: Passes raw unformatted incident text.',
      'Diagnostics Agent -> ITIL Agent: Passes identified root cause telemetry.',
      'ITIL Agent -> ServiceNow REST API: Executes GlideRecord patch update.'
    ],
    expectedInputs: ['ServiceNow Incident sys_id', 'Short Description', 'Raw Stack Trace / Log Excerpt'],
    expectedOutputs: 'Patched ServiceNow record with auto-populated category, subcategory, assignment group, and work notes entry.',
    implementationGuide: [
      'Configure ServiceNow Webhook / Business Rule on incident insertion.',
      'Deploy OpsPilot ServiceNow Connector with API token authentication.',
      'Bind LLM model pipeline (Claude 3.5 Sonnet recommended for ITIL reasoning).'
    ],
    benefits: [
      '58% reduction in MTTR.',
      'Zero manual triage overhead for P3/P4 tickets.',
      'Standardized ITIL metadata tagging across enterprise CMDB.'
    ],
    limitations: [
      'Requires active network access to ServiceNow REST endpoints.',
      'CMDB Configuration Items must be up to date for precise dependency mapping.'
    ],
    bestPractices: [
      'Set confidence score thresholds (e.g. 85%) before auto-closing low severity tickets.',
      'Store execution logs in OpsPilot audit table for compliance reviews.'
    ],
    relatedWorkflows: ['wf-rca-postmortem', 'wf-sql-optimizer'],
    faqs: [
      {
        question: 'Does this require MID Server deployment for on-premise ServiceNow instances?',
        answer: 'OpsPilot supports both direct REST API connections and MID Server proxy routing for restricted enterprise VPC environments.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Ticket Payload Ingestion & Sanitization',
        description: 'Sanitizes raw user ticket text, stripping personal identifiable information (PII) before LLM submission.',
        promptText: 'Extract core system error codes and strip PII from the following ticket text: {{raw_ticket_text}}',
        recommendedModel: 'claude',
        inputVariables: ['raw_ticket_text'],
        expectedOutputFormat: 'Cleaned JSON payload with system telemetry fields'
      },
      {
        stepNumber: 2,
        title: 'ITIL Category & Priority Matrix Mapping',
        description: 'Maps incident data against enterprise ITIL taxonomy to assign category, subcategory, urgency, and impact.',
        promptText: 'Given error telemetry {{cleaned_telemetry}}, map exact ServiceNow category, subcategory, assignment group, and priority.',
        recommendedModel: 'claude',
        inputVariables: ['cleaned_telemetry'],
        expectedOutputFormat: 'Structured JSON matching ServiceNow field schemas'
      },
      {
        stepNumber: 3,
        title: 'Work Notes & Resolution Guide Generation',
        description: 'Drafts technical work notes for assigned engineers and non-technical status update for the caller.',
        promptText: 'Draft technical work notes and customer update string for incident {{ticket_id}}.',
        recommendedModel: 'chatgpt',
        inputVariables: ['ticket_id'],
        expectedOutputFormat: 'Markdown text ready for ServiceNow GlideRecord update'
      }
    ],
    recommendedModels: ['claude', 'chatgpt'],
    expectedResults: 'Fully enriched ServiceNow incident ticket ready for immediate tier-2 intervention or automated resolution.',
    tags: ['ServiceNow', 'ITSM', 'Incident Triage', 'SRE', 'Automation'],
    downloadsCount: 3410,
    difficulty: 'Advanced',
    updatedAt: '2026-02-01'
  },
  {
    id: 'wf-rca-postmortem',
    title: 'Automated Blameless Root Cause Analysis (RCA) & SRE Post-Mortem Pipeline',
    slug: 'automated-root-cause-analysis-postmortem-pipeline',
    description: 'Generates SRE incident post-mortems following 5 Whys analysis, timeline extraction from Slack/Datadog logs, and remediation tasks.',
    category: 'DevOps & SRE',
    problemSolved: 'Saves 3+ hours per incident post-mortem while enforcing blameless engineering standards.',
    businessOverview: 'Engineering teams spend hours manually writing post-mortems after outages. This pipeline aggregates logs, alerts, and Slack incident channels into a structured 5 Whys SRE report.',
    architectureDiagram: `[Incident Logs + Slack Log] ──> (Timeline Synthesizer) ──> (5 Whys RCA Agent) ──> (Action Item Generator) ──> [Markdown Post-Mortem]`,
    stepByStepProcess: [
      'Ingest Datadog/Grafana alert logs and Slack incident channel transcripts.',
      'Extract timestamped incident timeline (Detection -> Containment -> Mitigation -> Resolution).',
      'Execute 5 Whys analysis prompt to uncover root cause technical failures.',
      'Generate Jira/GitHub action items categorized by P0 immediate fix, P1 short-term, P2 architecture hardening.'
    ],
    agentInteractions: [
      'Timeline Agent -> RCA Agent: Passes ordered timestamp log events.',
      'RCA Agent -> Remediation Agent: Passes identified failure mode.'
    ],
    expectedInputs: ['Raw Incident Slack Transcript', 'Monitoring System Alerts', 'Affected Microservice Name'],
    expectedOutputs: 'Comprehensive SRE Post-Mortem document with timeline, 5 Whys, and prioritized action items.',
    implementationGuide: [
      'Export Slack incident channel text to raw string.',
      'Run RCA workflow pipeline via OpsPilot Studio.',
      'Export resulting markdown report directly to Confluence or GitHub Docs.'
    ],
    benefits: [
      'Standardized SRE post-mortems across all engineering squads.',
      'Saves 3 hours of writing per incident.',
      'Identifies systemic architecture risks before repeat outages occur.'
    ],
    limitations: [
      'Requires chronological timestamp records for accurate timeline generation.'
    ],
    bestPractices: [
      'Include initial alert timestamp and engineer page timestamp for accurate Time-to-Acknowledge metrics.'
    ],
    relatedWorkflows: ['wf-servicenow-triage', 'wf-code-security-audit'],
    faqs: [
      {
        question: 'Can this automatically post action items to Jira?',
        answer: 'Yes! PromptImageLab OpsPilot provides Jira REST integrations to auto-create tickets for generated action items.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Timeline Extraction & Key Event Sequencing',
        description: 'Parses unstructured chat and monitoring logs into a chronological incident timeline.',
        promptText: 'Parse the following log transcript and build a timestamped incident timeline: {{log_transcript}}',
        recommendedModel: 'claude',
        inputVariables: ['log_transcript'],
        expectedOutputFormat: 'Markdown table with Timestamp, Component, Event Description'
      },
      {
        stepNumber: 2,
        title: '5 Whys Deep Technical Failure Analysis',
        description: 'Applies 5 Whys methodology to determine underlying systemic cause.',
        promptText: 'Based on timeline {{timeline}}, execute 5 Whys root cause analysis for service {{service_name}}.',
        recommendedModel: 'claude',
        inputVariables: ['timeline', 'service_name'],
        expectedOutputFormat: '5-level nested root cause explanation'
      },
      {
        stepNumber: 3,
        title: 'Remediation Task Generation & Prioritization',
        description: 'Generates prioritized P0/P1/P2 action items for Jira ticket creation.',
        promptText: 'Generate prioritized remediation tasks based on root cause {{root_cause}}.',
        recommendedModel: 'chatgpt',
        inputVariables: ['root_cause'],
        expectedOutputFormat: 'List of Jira-style tasks with Acceptance Criteria'
      }
    ],
    recommendedModels: ['claude', 'chatgpt'],
    expectedResults: 'Complete SRE Post-Mortem report ready for Confluence upload and team retrospective.',
    tags: ['SRE', 'Post-Mortem', 'DevOps', 'Root Cause Analysis', 'Jira'],
    downloadsCount: 2890,
    difficulty: 'Intermediate',
    updatedAt: '2026-02-03'
  },
  {
    id: 'wf-code-security-audit',
    title: 'Automated Pull Request Code Review & OWASP Security Audit Pipeline',
    slug: 'automated-pull-request-code-review-security-audit',
    description: 'A multi-agent GitHub CI/CD pipeline that reviews incoming code changes for OWASP vulnerabilities, performance anti-patterns, and unit test coverage gaps.',
    category: 'Software Development',
    problemSolved: 'Prevents security vulnerabilities and breaking changes from merging into production git branches.',
    businessOverview: 'Automates security reviews in GitHub/GitLab PRs, catching SQL injection, hardcoded API keys, and memory leaks before human reviewer approval.',
    architectureDiagram: `[Git Diff] ──> (Security Audit Agent) ──> (Performance Agent) ──> (Test Generator Agent) ──> [PR Review Comment]`,
    stepByStepProcess: [
      'Parse git diff file changes from GitHub pull request webhook.',
      'Execute security audit agent prompt checking for hardcoded credentials and OWASP Top 10 vulnerabilities.',
      'Execute performance analysis agent checking for N+1 queries or memory leaks.',
      'Post structured inline markdown comments directly to the pull request.'
    ],
    agentInteractions: [
      'Diff Reader -> Security Agent: Passes modified line chunks.',
      'Security Agent -> PR Notifier: Posts inline review comments.'
    ],
    expectedInputs: ['Git Diff Patch String', 'Target Language / Framework'],
    expectedOutputs: 'Formatted GitHub PR review comment with pass/fail security status and inline code fixes.',
    implementationGuide: [
      'Add GitHub Action workflow file triggering on pull_request event.',
      'Invoke PromptImageLab API endpoint with PR diff payload.',
      'Fail CI build status if Critical/High security issues are detected.'
    ],
    benefits: [
      '100% PR security audit coverage.',
      'Catches hardcoded secrets and SQL injection before code merge.',
      'Reduces human review cycle times.'
    ],
    limitations: [
      'Large PR diffs (>5,000 lines) should be split into smaller incremental audits.'
    ],
    bestPractices: [
      'Pair with automated static analysis tools (SonarQube, Snyk) for defense in depth.'
    ],
    relatedWorkflows: ['wf-sql-optimizer'],
    faqs: [
      {
        question: 'Does this store source code on external servers?',
        answer: 'No! PromptImageLab processes code in memory with zero data retention for complete enterprise code privacy.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'OWASP Security Scan',
        description: 'Scans PR diff for hardcoded secrets, SQL injection, XSS, and unsafe deserialization.',
        promptText: 'Audit the following git diff for OWASP vulnerabilities: {{git_diff}}',
        recommendedModel: 'claude',
        inputVariables: ['git_diff'],
        expectedOutputFormat: 'Vulnerability list with severity ratings and line numbers'
      },
      {
        stepNumber: 2,
        title: 'Refactored Code Fix Generation',
        description: 'Generates secure replacement code snippet for detected vulnerabilities.',
        promptText: 'Provide sanitized refactored code for vulnerability {{vulnerability_details}}.',
        recommendedModel: 'deepseek',
        inputVariables: ['vulnerability_details'],
        expectedOutputFormat: 'Clean code block ready for PR commit suggestion'
      }
    ],
    recommendedModels: ['claude', 'deepseek', 'chatgpt'],
    expectedResults: 'Automated GitHub PR review comment with security findings and inline refactored suggestions.',
    tags: ['GitHub Actions', 'Code Review', 'Security', 'DevOps', 'CI/CD'],
    downloadsCount: 4120,
    difficulty: 'Advanced',
    updatedAt: '2026-02-05'
  }
];
