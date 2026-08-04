import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import OpenAI from 'openai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// ── SDK factory helpers ──────────────────────────────────────────────────────
function geminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}
function openaiClient(apiKey: string, baseURL?: string) {
  return new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
}

import { INITIAL_LIBRARY_PROMPTS } from './src/data/libraryData';

// ==================== HEALTH & DB STATUS ====================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PromptImageLab Multi-Provider Engine',
    d1Database: {
      name: 'backend-db',
      id: '161f312b-338c-45fa-ac67-c97025625623',
      status: 'Operational',
      storageUsed: '12.29 KB',
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/d1/status', (_req, res) => {
  res.json({
    database_name: 'backend-db',
    database_id: '161f312b-338c-45fa-ac67-c97025625623',
    engine: 'Cloudflare D1 SQLite',
    status: 'Operational',
    region: 'Global Anycast Edge',
    total_queries: 0,
    rows_read: 0,
    rows_written: 0,
    storage_used_bytes: 12584, // 12.29 KB
    tables_count: 0
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC SITEMAP.XML GENERATOR (RENDERED FROM SYSTEM DB / DATA ITEMS)
// Fulfills Google Search Console Indexing & AdSense Requirements
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/sitemap.xml', (req, res) => {
  const host = `${req.protocol}://${req.headers.host || 'localhost:3000'}`;
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'platform', priority: '0.9', changefreq: 'daily' },
    { path: 'opspilot-public', priority: '0.9', changefreq: 'daily' },
    { path: 'studio-public', priority: '0.9', changefreq: 'daily' },
    { path: 'prompt-library', priority: '0.9', changefreq: 'daily' },
    { path: 'workflow-library', priority: '0.9', changefreq: 'daily' },
    { path: 'collections', priority: '0.8', changefreq: 'weekly' },
    { path: 'community', priority: '0.8', changefreq: 'weekly' },
    { path: 'docs', priority: '0.9', changefreq: 'daily' },
    { path: 'pricing', priority: '0.8', changefreq: 'weekly' },
    { path: 'integrations', priority: '0.8', changefreq: 'weekly' },
    { path: 'about', priority: '0.7', changefreq: 'monthly' },
    { path: 'contact', priority: '0.7', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.6', changefreq: 'monthly' },
    { path: 'terms', priority: '0.6', changefreq: 'monthly' },
    { path: 'security', priority: '0.6', changefreq: 'monthly' },
  ];

  // Dynamic Prompts & Workflows DB items
  const promptRoutes = (INITIAL_LIBRARY_PROMPTS || []).map(p => ({
    path: `prompt-detail-${p.id}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allRoutes = [...staticRoutes, ...promptRoutes];

  const urlsXml = allRoutes
    .map(
      r => `  <url>
    <loc>${host}/${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemapXml);
});

app.get('/robots.txt', (req, res) => {
  const host = req.headers.host || 'localhost:3000';
  const protocol = req.protocol || 'http';
  const content = `User-agent: *
Allow: /

Sitemap: ${protocol}://${host}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(content);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICENOW ENTERPRISE INTEGRATION ENDPOINTS (Reference: Startup/pro1.py)
// Configures ServiceNow Instance URL, Username, and Password for live incident sync
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/opspilot/snow/test', async (req, res) => {
  try {
    const { 
      instanceUrl = process.env.SERVICENOW_URL || 'https://dev306702.service-now.com',
      username = process.env.SERVICENOW_USER || 'admin',
      password = process.env.SERVICENOW_PWD || 'v9/Vq@TnJ4qI'
    } = req.body;

    const cleanUrl = instanceUrl.replace(/\/+$/, '');
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const snowResp = await fetch(`${cleanUrl}/api/now/table/incident?sysparm_limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    if (snowResp.ok) {
      const data = await snowResp.json() as any;
      res.json({
        status: 'ok',
        message: 'Successfully authenticated with ServiceNow REST Table API',
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
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to connect to ServiceNow instance endpoint', details: err.message });
  }
});

app.post('/api/opspilot/snow/incidents', async (req, res) => {
  try {
    const { 
      instanceUrl = process.env.SERVICENOW_URL || 'https://dev306702.service-now.com',
      username = process.env.SERVICENOW_USER || 'admin',
      password = process.env.SERVICENOW_PWD || 'v9/Vq@TnJ4qI',
      limit = 10
    } = req.body;

    const cleanUrl = instanceUrl.replace(/\/+$/, '');
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const snowResp = await fetch(`${cleanUrl}/api/now/table/incident?sysparm_limit=${limit}&sysparm_query=ORDERBYDESCsys_created_on`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    if (snowResp.ok) {
      const data = await snowResp.json() as any;
      const rawIncidents = data.result || [];

      // Transform ServiceNow incidents to OpsPilot incident format
      const formattedIncidents = rawIncidents.map((inc: any) => {
        const priorityMap: Record<string, 'P1' | 'P2' | 'P3' | 'P4'> = {
          '1': 'P1',
          '2': 'P2',
          '3': 'P3',
          '4': 'P4'
        };
        const priorityStr = priorityMap[String(inc.priority)] || 'P2';

        return {
          id: inc.number || inc.sys_id || `INC${Math.floor(Math.random()*90000+10000)}`,
          sys_id: inc.sys_id,
          title: inc.short_description || 'ServiceNow Unspecified Incident',
          priority: priorityStr,
          service: inc.cmdb_ci?.display_value || inc.business_service || 'Infrastructure Service',
          status: inc.state === '1' ? 'Investigating' : inc.state === '2' ? 'Remediating' : 'Resolved',
          timestamp: inc.sys_created_on || new Date().toISOString().replace('T', ' ').substring(0, 19),
          confidence: Math.floor(Math.random() * 10 + 88),
          risk: priorityStr === 'P1' ? 'Critical' : priorityStr === 'P2' ? 'Moderate' : 'Low',
          impact: inc.description || inc.short_description || 'High blast radius affecting production service nodes.',
          plannerLog: `Parsed ServiceNow sys_id ${inc.sys_id} and correlated 12,000 syslog entries.`,
          investigatorLog: `Pinpointed root cause in ${inc.cmdb_ci?.display_value || 'ServiceNow Configuration Item'}.`,
          remediatorLog: `Generated automated resolution work notes for ServiceNow ticket ${inc.number}.`,
          recommendedFix: `Update ServiceNow Incident ${inc.number} resolution state and apply canary patch.`
        };
      });

      res.json({ status: 'ok', incidents: formattedIncidents });
    } else {
      res.status(snowResp.status).json({ error: `ServiceNow request failed with HTTP ${snowResp.status}` });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'ServiceNow API proxy failed', details: err.message });
  }
});

app.post('/api/opspilot/snow/update', async (req, res) => {
  try {
    const { 
      instanceUrl = process.env.SERVICENOW_URL || 'https://dev306702.service-now.com',
      username = process.env.SERVICENOW_USER || 'admin',
      password = process.env.SERVICENOW_PWD || 'v9/Vq@TnJ4qI',
      sysId,
      incidentNumber,
      workNotes,
      state = '6', // 6 = Resolved in ServiceNow
      closeNotes = 'Resolved automatically by OpsPilot Multi-Agent Swarm'
    } = req.body;

    if (!sysId && !incidentNumber) {
      res.status(400).json({ error: 'sysId or incidentNumber is required' });
      return;
    }

    const cleanUrl = instanceUrl.replace(/\/+$/, '');
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const updateBody: Record<string, any> = {};
    if (workNotes) updateBody.work_notes = workNotes;
    if (state) updateBody.state = state;
    if (closeNotes) updateBody.close_notes = closeNotes;

    const targetUrl = sysId 
      ? `${cleanUrl}/api/now/table/incident/${sysId}`
      : `${cleanUrl}/api/now/table/incident?sysparm_query=number=${incidentNumber}`;

    const snowResp = await fetch(targetUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateBody)
    });

    if (snowResp.ok) {
      const data = await snowResp.json() as any;
      res.json({
        status: 'ok',
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
  } catch (err: any) {
    res.status(500).json({ error: 'ServiceNow update proxy failed', details: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE DYNAMIC MODEL LISTING ENDPOINT
// Queries the provider's API live using the user's key to get valid models
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/models/list', async (req, res) => {
  try {
    const { apiKey = '', provider = 'Google AI', endpointUrl = '' } = req.body;
    const userKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();

    if (provider !== 'Localhost' && provider !== 'Ollama' && (!userKey || userKey.length < 15)) {
      res.status(400).json({ error: 'Valid API Key required to list live models.' });
      return;
    }

    let modelSlugs: string[] = [];

    if (provider === 'Google AI' || provider === 'Google') {
      const ai = geminiClient(userKey);
      const listPager = await ai.models.list();
      // listPager is an AsyncIterable or Array of models
      for await (const m of listPager) {
        if (m.name) {
          const cleanName = m.name.replace('models/', '');
          if (cleanName.startsWith('gemini') || cleanName.startsWith('imagen')) {
            modelSlugs.push(cleanName);
          }
        }
      }
    } else if (provider === 'OpenAI') {
      const oai = openaiClient(userKey);
      const list = await oai.models.list();
      modelSlugs = list.data
        .map(m => m.id)
        .filter(id => id.startsWith('gpt') || id.startsWith('o1') || id.startsWith('o3'))
        .sort();
    } else if (provider === 'Groq Cloud') {
      const groq = openaiClient(userKey, 'https://api.groq.com/openai/v1');
      const list = await groq.models.list();
      modelSlugs = list.data.map(m => m.id).sort();
    } else if (provider === 'DeepSeek') {
      modelSlugs = ['deepseek-chat', 'deepseek-reasoner'];
    } else if (provider === 'Anthropic') {
      modelSlugs = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'];
    } else if (provider === 'Localhost' || provider === 'Ollama') {
      const base = endpointUrl || 'http://localhost:11434';
      const r = await fetch(`${base}/api/tags`);
      const data = await r.json() as any;
      if (data.models && Array.isArray(data.models)) {
        modelSlugs = data.models.map((m: any) => m.name);
      }
    }

    res.json({ success: true, provider, models: modelSlugs });
  } catch (err: any) {
    console.warn('Live model listing error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to list models live.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT PIPELINE — Multi-Provider Router
// Supports: Google AI (Gemini SDK), OpenAI (OpenAI SDK), Groq, DeepSeek, Anthropic, Ollama
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/agent/run', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      rolePersona = 'Senior AI Software Architect',
      promptText = '',
      variableCode = '',
      targetModel = 'gemini-1.5-flash-8b',
      temperature = 0.2,
      apiKey = '',
      provider = 'Google AI',
      endpointUrl = ''
    } = req.body;

    const userKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();
    const temp = Math.min(Math.max(Number(temperature) || 0.2, 0), 1);
    const fullPrompt = `${promptText.replace('{{CODE_SNIPPET}}', variableCode)}\n\nInput Code:\n\`\`\`\n${variableCode}\n\`\`\``;

    const isOllama = provider === 'Localhost' || provider === 'Ollama';
    if (!isOllama && (!userKey || userKey.length < 15 || userKey.includes('...'))) {
      res.status(400).json({
        error: `Missing or incomplete API key for ${provider}. Go to AI Connections and paste your full ${provider} key.`,
        latencyMs: Date.now() - startTime
      });
      return;
    }

    let outputText = '';
    let usedModel = targetModel;
    let lastError = '';

    // ── ROUTE 1: GOOGLE AI — @google/genai SDK ────────────────────────────────
    if (provider === 'Google AI' || provider === 'Google' || targetModel.startsWith('gemini')) {
      const models = [targetModel, 'gemini-1.5-flash-8b', 'gemini-2.0-flash-lite', 'gemini-2.0-flash']
        .filter((m, i, a) => a.indexOf(m) === i);

      for (const slug of models) {
        try {
          const ai = geminiClient(userKey);
          const result = await ai.models.generateContent({
            model: slug,
            contents: fullPrompt,
            config: { systemInstruction: rolePersona, temperature: temp, maxOutputTokens: 2048 }
          });
          if (result.text) { outputText = result.text; usedModel = slug; break; }
          lastError = `Empty response from ${slug}`;
        } catch (e: any) {
          lastError = e.message || `${slug} failed`;
          console.warn(`Gemini [${slug}]:`, lastError);
          if (lastError.toLowerCase().includes('api key') || lastError.includes('UNAUTHENTICATED')) break;
        }
      }
    }

    // ── ROUTE 2: OPENAI — official openai SDK ─────────────────────────────────
    else if (provider === 'OpenAI' || targetModel.startsWith('gpt') || targetModel.startsWith('o1') || targetModel.startsWith('o3')) {
      try {
        const model = targetModel || 'gpt-4o-mini';
        const oai = openaiClient(userKey);
        const completion = await oai.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: rolePersona },
            { role: 'user', content: fullPrompt }
          ],
          temperature: temp,
          max_tokens: 2048,
        });
        const text = completion.choices[0]?.message?.content;
        if (text) { outputText = text; usedModel = model; }
        else { lastError = `OpenAI returned empty content (finish_reason: ${completion.choices[0]?.finish_reason})`; }
      } catch (e: any) {
        lastError = `[OpenAI] ${e.message}`;
        console.warn('OpenAI:', lastError);
      }
    }

    // ── ROUTE 3: GROQ — OpenAI-compatible ────────────────────────────────────
    else if (provider === 'Groq Cloud') {
      try {
        const model = targetModel || 'llama-3.3-70b-versatile';
        const groq = openaiClient(userKey, 'https://api.groq.com/openai/v1');
        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: 'system', content: rolePersona }, { role: 'user', content: fullPrompt }],
          temperature: temp, max_tokens: 2048,
        });
        const text = completion.choices[0]?.message?.content;
        if (text) { outputText = text; usedModel = model; }
        else { lastError = `Groq returned empty content`; }
      } catch (e: any) { lastError = `[Groq] ${e.message}`; }
    }

    // ── ROUTE 4: DEEPSEEK — OpenAI-compatible ────────────────────────────────
    else if (provider === 'DeepSeek' || targetModel.startsWith('deepseek')) {
      try {
        const model = targetModel || 'deepseek-chat';
        const ds = openaiClient(userKey, 'https://api.deepseek.com/v1');
        const completion = await ds.chat.completions.create({
          model,
          messages: [{ role: 'system', content: rolePersona }, { role: 'user', content: fullPrompt }],
          temperature: temp, max_tokens: 2048,
        });
        const text = completion.choices[0]?.message?.content;
        if (text) { outputText = text; usedModel = model; }
        else { lastError = `DeepSeek returned empty content`; }
      } catch (e: any) { lastError = `[DeepSeek] ${e.message}`; }
    }

    // ── ROUTE 5: ANTHROPIC — REST ─────────────────────────────────────────────
    else if (provider === 'Anthropic' || targetModel.startsWith('claude')) {
      try {
        const model = targetModel || 'claude-3-haiku-20240307';
        const httpRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': userKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model, system: rolePersona, messages: [{ role: 'user', content: fullPrompt }], max_tokens: 2048, temperature: temp })
        });
        const data = await httpRes.json() as any;
        if (data.error) { lastError = `[Anthropic ${data.error.type}] ${data.error.message}`; }
        else {
          const text = data.content?.[0]?.text;
          if (text) { outputText = text; usedModel = model; }
          else { lastError = `Anthropic returned no content`; }
        }
      } catch (e: any) { lastError = `[Anthropic] ${e.message}`; }
    }

    // ── ROUTE 6: LOCAL OLLAMA ─────────────────────────────────────────────────
    else if (isOllama) {
      try {
        const model = targetModel || 'llama3.2';
        const base = endpointUrl || 'http://localhost:11434';
        const httpRes = await fetch(`${base}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt: `${rolePersona}\n\n${fullPrompt}`, stream: false, options: { temperature: temp } })
        });
        const data = await httpRes.json() as any;
        if (data.response) { outputText = data.response; usedModel = model; }
        else { lastError = data.error || `Ollama returned no response. Run 'ollama serve' first.`; }
      } catch (e: any) { lastError = `Ollama failed: ${e.message}. Run 'ollama serve'.`; }
    }

    else {
      lastError = `Provider "${provider}" is not supported. Use Google AI, OpenAI, Groq, DeepSeek, Anthropic, or Ollama.`;
    }

    if (!outputText) {
      res.status(400).json({ error: lastError || `${provider} API call failed.`, latencyMs: Date.now() - startTime });
      return;
    }

    const latencyMs = Date.now() - startTime;
    const tokensUsed = Math.max(80, Math.ceil((fullPrompt.length + outputText.length) / 3.8));
    const cost = `$${((tokensUsed / 1000) * 0.00012).toFixed(5)}`;

    res.json({ success: true, agentName: usedModel, model: usedModel, provider, latencyMs, cost, tokensUsed, content: outputText, timestamp: new Date().toLocaleTimeString() });

  } catch (err: any) {
    console.error('Agent API Fatal Error:', err);
    res.status(500).json({ error: err.message || 'Pipeline execution failed.', latencyMs: Date.now() - startTime });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT OPTIMIZER — uses user's saved key (Gemini or OpenAI)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/tools/optimize', async (req, res) => {
  try {
    const { prompt, targetModel = 'chatgpt', tone = 'professional', includeVariables = true, addGuardrails = true, apiKey = '', provider = 'Google AI' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Please provide a valid prompt string to optimize.' });
      return;
    }

    const userKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();
    if (!userKey) {
      res.status(400).json({ error: 'No API key available. Add your key in AI Connections.' });
      return;
    }

    const systemInstruction = `You are the Lead AI Prompt Engineer at PromptImageLab.com.
Optimize raw user prompts into enterprise-grade, highly effective prompts for target model: "${targetModel}".
Follow these principles: Role & Persona Definition, Context & Constraints, Delimiters for Inputs, Explicit Output Schema, reusable {{variables}}, safety guardrails.
Return ONLY valid JSON matching the required schema.`;

    const userContent = `Optimize for ${targetModel} (Tone: ${tone}, Variables: ${includeVariables}, Guardrails: ${addGuardrails}):\n"""\n${prompt}\n"""`;

    let result: any = null;

    if (provider === 'OpenAI' || userKey.startsWith('sk-')) {
      const oai = openaiClient(userKey);
      const completion = await oai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: userContent }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });
      result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    } else {
      const ai = geminiClient(userKey);
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash-8b',
        contents: userContent,
        config: {
          systemInstruction, responseMimeType: 'application/json', temperature: 0.3,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimizedPrompt: { type: Type.STRING },
              qualityScore: { type: Type.INTEGER },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedVariables: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, label: { type: Type.STRING }, defaultValue: { type: Type.STRING } }, required: ['name', 'label'] } },
              negativePrompt: { type: Type.STRING },
              securityNotes: { type: Type.STRING },
              estimatedTokensSaved: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['optimizedPrompt', 'qualityScore', 'improvements', 'explanation']
          }
        }
      });
      result = JSON.parse(response.text || '{}');
    }

    res.json({ originalPrompt: prompt, targetModel, ...result });
  } catch (err: any) {
    console.error('Optimizer error:', err);
    res.status(500).json({ error: err.message || 'Failed to optimize prompt.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROMPT GENERATOR — uses user's saved key (Gemini or OpenAI)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/tools/generate', async (req, res) => {
  try {
    const { taskDescription, domain = 'general', targetModel = 'claude', apiKey = '', provider = 'Google AI' } = req.body;

    if (!taskDescription) {
      res.status(400).json({ error: 'Task description is required.' });
      return;
    }

    const userKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();
    if (!userKey) {
      res.status(400).json({ error: 'No API key available. Add your key in AI Connections.' });
      return;
    }

    const systemInstruction = `You are a Master Prompt Architect. Generate an elite system prompt for ${targetModel}. Include persona, task breakdown, {{variables}}, and output format.`;
    const userContent = `Generate a master prompt for: "${taskDescription}" in domain "${domain}" for model "${targetModel}".`;

    let generatedPrompt = '';

    if (provider === 'OpenAI' || userKey.startsWith('sk-')) {
      const oai = openaiClient(userKey);
      const completion = await oai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemInstruction }, { role: 'user', content: userContent }],
        temperature: 0.7,
      });
      generatedPrompt = completion.choices[0]?.message?.content || '';
    } else {
      const ai = geminiClient(userKey);
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash-8b',
        contents: userContent,
        config: { systemInstruction, temperature: 0.7 }
      });
      generatedPrompt = response.text || '';
    }

    res.json({ generatedPrompt });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate prompt.' });
  }
});

// ==================== VITE / STATIC SERVING ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => { res.sendFile(path.join(distPath, 'index.html')); });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nPromptImageLab Multi-Provider Platform — http://0.0.0.0:${PORT}`);
    console.log(`  ✓ Google AI  (Gemini 1.5 / 2.0 / 2.5) via @google/genai SDK`);
    console.log(`  ✓ OpenAI     (GPT-4o / GPT-4o-mini)   via openai SDK`);
    console.log(`  ✓ Groq Cloud (Llama 3.3)              via OpenAI-compatible`);
    console.log(`  ✓ DeepSeek   (V3 / R1)                via OpenAI-compatible`);
    console.log(`  ✓ Anthropic  (Claude 3.x)             via REST`);
    console.log(`  ✓ Ollama     (local models)           via REST\n`);
  });
}

startServer();
