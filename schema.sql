CREATE TABLE IF NOT EXISTS prompts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  content    TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'general',
  image      TEXT,
  meta_desc  TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prompts_slug     ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_created  ON prompts(created_at DESC);

INSERT OR IGNORE INTO prompts (title, slug, content, category, meta_desc) VALUES
(
  'Instagram DP AI Prompts',
  'instagram-dp-ai-prompts',
  '<h2>Instagram DP AI Prompts</h2><p>Create stunning AI-generated Instagram display pictures with these proven prompts. Whether you want a natural portrait, artistic avatar, or stylized photo, these prompts work across all major AI tools.</p><h3>Top Instagram DP Prompts</h3><ul><li>Professional portrait, soft studio lighting, bokeh background, sharp focus on face, Instagram-ready, 1:1 crop</li><li>Aesthetic close-up portrait, warm golden hour lighting, film grain, candid mood, natural expression</li><li>High-fashion portrait, editorial lighting, dramatic shadows, stylized background, crisp detail</li><li>Vibrant lifestyle portrait, outdoor natural light, confident expression, shallow depth of field</li><li>Minimalist portrait, clean white background, professional attire, polished finish</li></ul><h3>How to Use These Prompts</h3><p>Upload your photo to an AI tool like Midjourney, DALL-E 3, or Stable Diffusion. Append these prompts after describing your subject. Adjust lighting and style keywords to match your personal aesthetic.</p>',
  'instagram',
  'Best AI prompts for Instagram DP – create stunning profile pictures with Midjourney, DALL-E, and Stable Diffusion.'
),
(
  'Anime Avatar AI Prompts',
  'anime-avatars',
  '<h2>Anime Avatar AI Prompts</h2><p>Transform yourself into a stunning anime character with these carefully crafted prompts. Perfect for Discord, gaming profiles, and social media.</p><h3>Anime Avatar Prompt Templates</h3><ul><li>Anime portrait, Studio Ghibli style, soft watercolor shading, expressive eyes, detailed hair, pastel background</li><li>Cyberpunk anime avatar, neon city background, glowing eyes, futuristic outfit, high detail, 4K</li><li>Shonen manga style avatar, dynamic pose, spiky hair, intense expression, action background</li><li>Shoujo anime portrait, soft pink tones, sparkle effects, long flowing hair, gentle smile</li><li>Dark fantasy anime character, dramatic lighting, intricate armor details, piercing gaze</li></ul><h3>Pro Anime Prompt Tips</h3><p>Specify the anime studio style (Ghibli, Trigger, KyoAni) for consistent results. Add cel shading for that classic anime look, or painterly for a more artistic finish.</p>',
  'anime',
  'Best anime avatar AI prompts – generate Studio Ghibli, cyberpunk, and shonen style anime avatars with AI.'
),
(
  'CEO Style Portrait Prompts',
  'ceo-style-portrait-prompts',
  '<h2>CEO Style Portrait Prompts</h2><p>Command authority and professionalism with these executive-grade AI portrait prompts. Ideal for LinkedIn, company websites, and press kits.</p><h3>Executive Portrait Prompts</h3><ul><li>Executive headshot, corporate attire, confident expression, office background, professional lighting, sharp focus</li><li>CEO portrait, power pose, navy blue suit, clean modern office, directional studio lighting, high resolution</li><li>Business leader portrait, warm office lighting, serious but approachable expression, bookshelf background</li><li>Corporate headshot, grey background, perfect exposure, polished look, LinkedIn-ready format</li><li>Modern entrepreneur portrait, casual smart outfit, natural light, creative workspace background</li></ul><h3>Tips for Professional AI Headshots</h3><p>Always specify attire color and style. Mention the background environment. Add lighting descriptors like Rembrandt lighting or soft diffused light for premium results.</p>',
  'professional',
  'CEO and executive AI portrait prompts – generate LinkedIn-ready professional headshots with AI tools.'
),
(
  'Corporate Portrait Prompts',
  'corporate-portrait-prompts',
  '<h2>Corporate Portrait Prompts</h2><p>Professional AI prompts for corporate headshots, team photos, and business profile images that convey trust and competence.</p><h3>Corporate Headshot Prompts</h3><ul><li>Corporate headshot, business formal attire, neutral background, professional smile, studio quality lighting</li><li>Team photo style portrait, corporate casual, warm neutral tones, approachable expression, sharp detail</li><li>Financial professional portrait, dark suit, white shirt, confident pose, classic studio background</li><li>Healthcare professional portrait, white coat, clean clinical background, trustworthy expression</li><li>Tech executive portrait, smart casual, modern office, glass walls, contemporary feel</li></ul><h3>Corporate Prompt Best Practices</h3><p>For corporate imagery, keep backgrounds neutral or office-appropriate. Specify dress code precisely. Ensure lighting prompts mention even or professional for best results.</p>',
  'professional',
  'Corporate portrait AI prompts – generate professional business headshots for LinkedIn and company profiles.'
),
(
  'AI Profile Picture DP Prompts',
  'ai-profile-picture-dp-prompts',
  '<h2>AI Profile Picture DP Prompts</h2><p>Universal AI prompts for creating stunning profile pictures across any platform.</p><h3>Universal DP Prompt Collection</h3><ul><li>High-quality portrait, professional lighting, clean background, natural expression, sharp focus, social media ready</li><li>Artistic profile picture, painted portrait style, warm tones, expressive look, detailed brushwork</li><li>Futuristic avatar, holographic elements, tech aesthetic, vibrant colors, digital art style</li><li>Vintage film portrait, 35mm grain, warm amber tones, candid expression, nostalgic mood</li><li>Fantasy portrait, magical elements, ethereal lighting, detailed costume, dramatic atmosphere</li></ul><h3>Platform-Specific Tips</h3><p>Instagram and WhatsApp favor square crops. Twitter works best with centered compositions. LinkedIn prefers neutral backgrounds with professional framing.</p>',
  'general',
  'Best AI prompts for profile pictures and DPs across Instagram, WhatsApp, Twitter, and all social platforms.'
),
(
  'Instagram DP Black and White AI Prompts',
  'instagram-dp-black-white-ai-prompts',
  '<h2>Instagram DP Black and White AI Prompts</h2><p>Create timeless, dramatic black and white profile pictures with these fine-tuned AI prompts.</p><h3>Black and White Portrait Prompts</h3><ul><li>Black and white portrait, high contrast, dramatic shadows, sharp detail, fine art photography style</li><li>Monochrome headshot, Rembrandt lighting, deep blacks, crisp whites, silver gelatin print aesthetic</li><li>B&W lifestyle portrait, natural light, grain texture, documentary photography style, raw emotion</li><li>Classic film noir portrait, hard shadows, mysterious mood, 1940s Hollywood aesthetic</li><li>Editorial black and white portrait, fashion magazine style, perfect exposure, striking composition</li></ul><h3>B&W Prompt Techniques</h3><p>Add high contrast for drama, soft gradient for elegance, or film grain for authenticity. Reference photographers like Ansel Adams for consistent stylistic results.</p>',
  'instagram',
  'Black and white Instagram DP AI prompts – create dramatic, timeless monochrome profile pictures with AI.'
);
