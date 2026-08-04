import React from 'react';
import { SeoHead } from '../seo/SeoHead';

export const RobotsTxtView: React.FC = () => {
  const robotsTxtContent = `User-agent: *
Allow: /
Allow: /platform
Allow: /opspilot
Allow: /studio
Allow: /community
Allow: /prompt-library
Allow: /workflow-library
Allow: /use-cases
Allow: /comparisons
Allow: /integrations
Allow: /docs
Allow: /pricing
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /cookie-policy

Disallow: /admin
Disallow: /api/private/

Sitemap: https://promptimagelab.com/sitemap.xml`;

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-400 p-8 font-mono text-xs">
      <SeoHead
        title="robots.txt"
        description="Standardized robots.txt rules for search crawler indexing."
        canonicalUrl="https://promptimagelab.com/robots.txt"
      />
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-slate-500 pb-2 border-b border-slate-800">
          # PromptImageLab Standard Crawling Guidelines (robots.txt)
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">{robotsTxtContent}</pre>
      </div>
    </div>
  );
};
