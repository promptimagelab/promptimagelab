import { ToolMeta } from '../types';

export const ALL_TOOLS: ToolMeta[] = [
  {
    id: 't-1',
    name: 'Prompt Optimizer',
    slug: 'prompt-optimizer',
    category: 'Optimization',
    description: 'Transform raw or vague prompts into high-precision, structured prompts tailored for specific LLMs (ChatGPT, Claude, Gemini, Midjourney).',
    iconName: 'Wand2',
    isPopular: true,
    endpoint: '/api/tools/optimize'
  },
  {
    id: 't-2',
    name: 'Prompt Generator',
    slug: 'prompt-generator',
    category: 'Generation',
    description: 'Generate production-ready master prompts from a simple 1-line description of your task or business goal.',
    iconName: 'Sparkles',
    isPopular: true,
    endpoint: '/api/tools/generate'
  },
  {
    id: 't-3',
    name: 'Prompt Debugger',
    slug: 'prompt-debugger',
    category: 'Security & Testing',
    description: 'Diagnose failing prompts that produce hallucinations, off-topic answers, or formatting errors, with step-by-step fix recommendations.',
    iconName: 'Bug',
    isPopular: true,
    endpoint: '/api/tools/debug'
  },
  {
    id: 't-4',
    name: 'Prompt Security & Quality Checker',
    slug: 'prompt-security-checker',
    category: 'Security & Testing',
    description: 'Audit prompts for prompt injection vulnerabilities, system prompt leakage, token waste, and jailbreak risks.',
    iconName: 'ShieldCheck',
    isPopular: true,
    endpoint: '/api/tools/quality'
  },
  {
    id: 't-5',
    name: 'Image Prompt Builder (Midjourney & Flux)',
    slug: 'image-prompt-builder',
    category: 'Image & Vision',
    description: 'Craft ultra-detailed photorealistic or stylized image prompts with camera lenses, lighting, resolution, and render parameters.',
    iconName: 'Camera',
    isPopular: true,
    endpoint: '/api/tools/image-builder'
  },
  {
    id: 't-6',
    name: 'Token & Cost Calculator',
    slug: 'token-cost-calculator',
    category: 'Utility',
    description: 'Estimate token counts and operational costs across 15+ top AI models (GPT-4o, Claude 3.5 Sonnet, Gemini 3.6 Flash, DeepSeek R1).',
    iconName: 'Calculator',
    isPopular: true,
    endpoint: '/api/tools/token-cost'
  },
  {
    id: 't-7',
    name: 'Live Prompt Playground',
    slug: 'prompt-playground',
    category: 'Security & Testing',
    description: 'Test and execute your prompts live with temperature, system instructions, and real-time response analysis.',
    iconName: 'Play',
    isPopular: true,
    endpoint: '/api/tools/playground'
  },
  {
    id: 't-8',
    name: 'Prompt Translator',
    slug: 'prompt-translator',
    category: 'Utility',
    description: 'Translate prompts across 20+ languages while preserving exact model command syntax, variable placeholders, and technical terms.',
    iconName: 'Languages',
    endpoint: '/api/tools/translate'
  },
  {
    id: 't-9',
    name: 'Prompt Refiner & Rewriter',
    slug: 'prompt-refiner',
    category: 'Optimization',
    description: 'Refine the tone, conciseness, or formatting of existing prompts for executive briefs, technical docs, or creative copy.',
    iconName: 'Edit3',
    endpoint: '/api/tools/refine'
  },
  {
    id: 't-10',
    name: 'Image to Prompt Generator',
    slug: 'image-to-prompt',
    category: 'Image & Vision',
    description: 'Deconstruct any visual image into a detailed Midjourney, Flux, or SDXL text prompt.',
    iconName: 'ImagePlus',
    isNew: true,
    endpoint: '/api/tools/image-to-prompt'
  },
  {
    id: 't-11',
    name: 'Prompt Variable Builder',
    slug: 'variable-builder',
    category: 'Utility',
    description: 'Automatically identify and convert hardcoded text in your prompts into reusable dynamic variables (`{{variable_name}}`).',
    iconName: 'Brackets',
    endpoint: '/api/tools/variable-builder'
  },
  {
    id: 't-12',
    name: 'AI Persona Generator',
    slug: 'persona-generator',
    category: 'Generation',
    description: 'Create detailed system instruction personas (e.g. Senior Tax Attorney, Chief Marketing Officer, SRE Engineer).',
    iconName: 'UserCheck',
    endpoint: '/api/tools/persona'
  },
  {
    id: 't-13',
    name: 'Negative Prompt Generator',
    slug: 'negative-prompt-generator',
    category: 'Image & Vision',
    description: 'Build comprehensive negative prompt strings to eliminate anatomical defects, unwanted background clutter, and artifacts.',
    iconName: 'Slash',
    endpoint: '/api/tools/negative-prompt'
  },
  {
    id: 't-14',
    name: 'SQL Query Prompt Generator',
    slug: 'sql-generator',
    category: 'Generation',
    description: 'Generate precise SQL schema query prompts for complex multi-table joins, CTEs, and window functions.',
    iconName: 'Database',
    endpoint: '/api/tools/sql'
  },
  {
    id: 't-15',
    name: 'JSON Schema Formatter',
    slug: 'json-formatter',
    category: 'Utility',
    description: 'Format unstructured outputs into validated JSON Schemas or TypeScript type declarations.',
    iconName: 'Code2',
    endpoint: '/api/tools/json'
  }
];
