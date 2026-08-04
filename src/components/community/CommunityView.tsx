import React, { useState } from 'react';
import { SeoHead } from '../seo/SeoHead';
import { Sparkles, Milestone, ThumbsUp, Mail, MessageSquare, Send, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Card, Badge, Button } from '@ui-core';

interface FeatureRequest {
  id: string;
  title: string;
  desc: string;
  upvotes: number;
  status: 'In Planning' | 'Under Review' | 'In Development';
  category: string;
}

const INITIAL_REQUESTS: FeatureRequest[] = [
  {
    id: '1',
    title: 'Self-Hosted Helm Chart for Air-Gapped Kubernetes VPCs',
    desc: 'Deploy OpsPilot and Studio runner pods directly into private corporate clusters without external internet egress.',
    upvotes: 142,
    status: 'In Development',
    category: 'Infrastructure'
  },
  {
    id: '2',
    title: 'Datadog & Splunk Log Stream Integrations',
    desc: 'Stream live error trace logs directly into Studio agent execution pipelines for immediate root cause analysis.',
    upvotes: 98,
    status: 'In Planning',
    category: 'Integrations'
  },
  {
    id: '3',
    title: 'LoRA Fine-Tuning Synthetic Data Exporter',
    desc: 'Export validated prompt-response execution traces directly into OpenAI JSONL or HuggingFace LoRA fine-tuning format.',
    upvotes: 76,
    status: 'Under Review',
    category: 'AI Pipeline'
  }
];

export const CommunityView: React.FC = () => {
  const [requests, setRequests] = useState<FeatureRequest[]>(INITIAL_REQUESTS);
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>({});
  const [emailInput, setEmailInput] = useState('');
  const [submittedWaitlist, setSubmittedWaitlist] = useState(false);
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestDesc, setNewRequestDesc] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const toggleUpvote = (id: string) => {
    const isUpvoted = upvotedMap[id];
    setUpvotedMap({ ...upvotedMap, [id]: !isUpvoted });
    setRequests(requests.map(r => r.id === id ? { ...r, upvotes: isUpvoted ? r.upvotes - 1 : r.upvotes + 1 } : r));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubmittedWaitlist(true);
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequestTitle.trim()) {
      setRequests([
        {
          id: Date.now().toString(),
          title: newRequestTitle,
          desc: newRequestDesc || 'Submitted by community engineer.',
          upvotes: 1,
          status: 'Under Review',
          category: 'Community Suggestion'
        },
        ...requests
      ]);
      setNewRequestTitle('');
      setNewRequestDesc('');
      setShowSubmitModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 select-none animate-fadeIn">
      <SeoHead
        title="Community & Early Access Hub | PromptImageLab Roadmap"
        description="Join the PromptImageLab early access program, vote on platform features, track our development roadmap, and join our waitlist."
        canonicalUrl="https://promptimagelab.com/community"
      />

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Early Access Program</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Community & Roadmap Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We are building PromptImageLab transparently with our early adopters. Vote on upcoming feature requests, follow our public roadmap, and secure your place on the Discord & Community waitlist.
            </p>
          </div>

          <Card className="p-6 bg-slate-800/80 border-slate-700 space-y-4 shrink-0 max-w-md w-full">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <strong className="text-sm font-bold text-white">Join Early Access Waitlist</strong>
            </div>
            
            {submittedWaitlist ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>You're on the waitlist! We'll notify you as new seats open.</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <Button variant="primary" size="sm" type="submit" className="w-full font-bold">
                  Subscribe & Request Access
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* SECTION 1: PUBLIC ROADMAP TIMELINE */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="indigo">Public Roadmap</Badge>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1">Platform Development Timeline</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="indigo">Q3 2026 • Live</Badge>
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="font-bold text-base">ServiceNow Integration & Clean URLs</h3>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> HTML5 History API Clean Routing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Live ServiceNow REST API Incident Sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Multi-Model Execution in Agent Studio</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="violet">Q4 2026 • Building</Badge>
                <Clock className="w-4 h-4 text-violet-500" />
              </div>
              <h3 className="font-bold text-base">Self-Hosted Kubernetes Worker</h3>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-violet-500" /> Helm chart deployment for enterprise VPCs</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-violet-500" /> Local Ollama & vLLM model support</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-violet-500" /> Discord & Community Forum launch</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="amber">2027 • Planned</Badge>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-bold text-base">Fine-Tuning Dataset Generator</h3>
              <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-500" /> Automatic LoRA dataset exporter</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-500" /> Multi-agent swarm consensus evaluator</li>
                <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-amber-500" /> Enterprise SAML / Okta SSO</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURE REQUEST VOTING */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="emerald">Community Voice</Badge>
              <h2 className="text-2xl font-extrabold tracking-tight mt-1">Feature Requests & Upvoting</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubmitModal(!showSubmitModal)}
              className="font-bold flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feature Request</span>
            </Button>
          </div>

          {/* New Request Modal/Form */}
          {showSubmitModal && (
            <Card className="p-6 bg-slate-50 dark:bg-slate-900 border-indigo-500/50 space-y-4 animate-fadeIn">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Submit New Feature Request</h4>
              <form onSubmit={handleCreateRequest} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Feature Title (e.g. Datadog Log Integration)"
                  value={newRequestTitle}
                  onChange={(e) => setNewRequestTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <textarea
                  rows={3}
                  placeholder="Describe why this feature would help your engineering team..."
                  value={newRequestDesc}
                  onChange={(e) => setNewRequestDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit" className="font-bold">Post Request</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {requests.map(req => {
              const isUpvoted = upvotedMap[req.id];
              return (
                <div key={req.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px] font-bold">{req.category}</Badge>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{req.status}</span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{req.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{req.desc}</p>
                  </div>

                  <button
                    onClick={() => toggleUpvote(req.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all shrink-0 min-w-16 ${
                      isUpvoted
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 mb-1" />
                    <span className="text-xs font-extrabold">{req.upvotes}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: FUTURE COMMUNITY CHANNELS */}
        <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            <div>
              <h3 className="text-xl font-extrabold">Upcoming Community Channels (Q4 2026)</h3>
              <p className="text-xs text-slate-400">Join early access now to receive automatic invites upon official community launch.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="block text-white font-bold">Official Discord Server</strong>
                <span className="text-slate-400">Real-time interaction with core engineering leads.</span>
              </div>
              <Badge variant="indigo">Waitlist Open</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <strong className="block text-white font-bold">Discourse Community Forum</strong>
                <span className="text-slate-400">Long-form prompt benchmark showcases & SRE blueprints.</span>
              </div>
              <Badge variant="violet">Waitlist Open</Badge>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
