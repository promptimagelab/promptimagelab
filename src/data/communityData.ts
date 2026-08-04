import { CommunityPost } from '../types';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    slug: 'servicenow-opspilot-triage-best-practices',
    title: 'How we reduced P2 Incident MTTR by 60% using PromptImageLab OpsPilot',
    authorName: 'David Chen',
    authorRole: 'Head of Infrastructure @ CloudScale',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    category: 'Showcase',
    content: 'We integrated OpsPilot with our ServiceNow ITSM instance 3 weeks ago. By binding the ITIL Triage Workflow to incident creation webhooks, our tier-1 service desk automated ticket field tagging and diagnostic command suggestions. MTTR dropped from 42 mins to 17 mins!',
    likesCount: 142,
    commentsCount: 28,
    tags: ['ServiceNow', 'OpsPilot', 'Case Study', 'SRE'],
    createdAt: '2026-02-01',
    isPinned: true
  },
  {
    id: 'post-2',
    slug: 'zero-hallucination-json-schema-tips',
    title: 'Tips for achieving 99.9% reliable JSON output from Claude 3.5 Sonnet & GPT-4o',
    authorName: 'Elena Rostova',
    authorRole: 'Principal AI Engineer',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    category: 'Discussions',
    content: 'Sharing our empirical benchmark results after testing 10,000 JSON schema extraction runs across Anthropic, OpenAI, and DeepSeek models. Key lesson: Always use XML delimiters around variable input blocks, and pass explicit JSON Schema examples in system prompts.',
    likesCount: 98,
    commentsCount: 19,
    tags: ['Prompt Engineering', 'JSON Schema', 'Claude 3.5', 'Benchmarking'],
    createdAt: '2026-02-03'
  },
  {
    id: 'post-3',
    slug: 'feature-request-mcp-datadog-connector',
    title: 'Feature Request: Native Datadog Synthetic Monitoring MCP Connector',
    authorName: 'Marcus Vance',
    authorRole: 'DevOps Lead @ FinTech Global',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    category: 'Feature Requests',
    content: 'Would love to see an official Datadog MCP server connector in OpsPilot so agents can query synthetic test failures and trace spans directly when analyzing ServiceNow tickets!',
    likesCount: 76,
    commentsCount: 12,
    tags: ['Feature Request', 'Datadog', 'MCP', 'OpsPilot'],
    createdAt: '2026-02-04'
  }
];
