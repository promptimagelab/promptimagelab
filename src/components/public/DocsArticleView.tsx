import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Clock, Calendar, Users, Copy, Check, 
  ChevronRight, BookOpen, AlertCircle, ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getArticleBySlug, docsDatabase, DocArticle } from '../../data/docsData';
import { useSEO } from '../../hooks/useSEO';
import { useToast } from '../ui/Toast';

interface DocsArticleViewProps {
  articleSlug: string;
  onBackToDocs: () => void;
  onSelectArticle: (slug: string) => void;
}

interface CodeBlockProps { code: string; language: string; }
const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast('Copied to clipboard', { type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-5 bg-slate-950 dark:bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

export const DocsArticleView: React.FC<DocsArticleViewProps> = ({
  articleSlug,
  onBackToDocs,
  onSelectArticle
}) => {
  const article = getArticleBySlug(articleSlug);
  const [activeSection, setActiveSection] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: `${article?.title || 'Documentation'} | PromptImageLab Docs`,
    description: article?.description || 'Technical documentation for PromptImageLab.',
    keywords: article?.keywords?.join(', ') || 'PromptImageLab Docs'
  });

  useEffect(() => {
    if (!article || !contentRef.current) return;
    const headings = contentRef.current.querySelectorAll('h2[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [article, articleSlug]);

  if (!article) {
    return (
      <div className="w-full max-w-3xl mx-auto py-24 px-6 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <p className="text-slate-500 text-sm">The guide "<code>{articleSlug}</code>" does not exist in the knowledge base.</p>
        <button onClick={onBackToDocs} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
          Back to Documentation Hub
        </button>
      </div>
    );
  }

  const currentIndex = docsDatabase.findIndex((d) => d.slug === article.slug);
  const prevArticle = currentIndex > 0 ? docsDatabase[currentIndex - 1] : null;
  const nextArticle = currentIndex < docsDatabase.length - 1 ? docsDatabase[currentIndex + 1] : null;

  return (
    <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBackToDocs}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Docs
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 overflow-hidden">
            <span className="hidden sm:block">Documentation</span>
            <ChevronRight className="w-3.5 h-3.5 hidden sm:block" />
            <span className="text-indigo-500 truncate max-w-[200px]">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main article content */}
          <main className="lg:col-span-9 min-w-0 space-y-8">
            <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  {article.product}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                  {article.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {article.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {article.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" /> {article.lastUpdated}
                </span>
              </div>
            </div>

            <div ref={contentRef} className="space-y-8">
              {article.sections.map((sec) => (
                <div key={sec.id} id={sec.id} className="space-y-3 scroll-mt-28">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sec.content}
                  </p>
                  {sec.codeSnippet && (
                    <CodeBlock code={sec.codeSnippet.code} language={sec.codeSnippet.language} />
                  )}
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
              {prevArticle ? (
                <button
                  onClick={() => onSelectArticle(prevArticle.slug)}
                  className="flex flex-col gap-1 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {prevArticle.title}
                  </span>
                </button>
              ) : <div />}

              {nextArticle && (
                <button
                  onClick={() => onSelectArticle(nextArticle.slug)}
                  className="flex flex-col gap-1 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-right transition-all"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 justify-end">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {nextArticle.title}
                  </span>
                </button>
              )}
            </div>
          </main>

          {/* Right sticky meta */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-[60px] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Audience</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{article.targetAudience}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Author</span>
                  <span className="font-bold text-slate-900 dark:text-white">{article.author}</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
