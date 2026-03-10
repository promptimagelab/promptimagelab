<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  exclude-result-prefixes="sm image xsi">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="robots" content="noindex,nofollow"/>
        <title>Sitemap — PromptImageLab</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0f1a;color:#e2e8f0;line-height:1.55;min-height:100vh}
          .wrap{max-width:1000px;margin:0 auto;padding:40px 20px}
          .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.08)}
          .logo{font-size:1.4rem;font-weight:800;color:#fff}.logo span{color:#38bdf8}
          .badge{font-size:.72rem;font-weight:700;background:rgba(56,189,248,.12);color:#38bdf8;border:1px solid rgba(56,189,248,.25);padding:3px 10px;border-radius:99px}
          h1{font-size:1.1rem;font-weight:700;margin-bottom:4px}
          .sub{font-size:.82rem;color:#8898aa;margin-bottom:24px}
          .stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin-bottom:28px}
          .stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 16px;text-align:center}
          .stat-val{font-size:1.5rem;font-weight:800;color:#38bdf8}
          .stat-lbl{font-size:.72rem;color:#8898aa;margin-top:3px}
          table{width:100%;border-collapse:collapse;font-size:.82rem}
          thead th{background:rgba(255,255,255,.05);padding:10px 14px;text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#8898aa;border-bottom:1px solid rgba(255,255,255,.08)}
          tbody tr{border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}
          tbody tr:hover{background:rgba(56,189,248,.04)}
          td{padding:10px 14px;vertical-align:middle}
          td a{color:#38bdf8;text-decoration:none;word-break:break-all;font-size:.8rem}
          td a:hover{text-decoration:underline}
          .p-high{color:#4ade80}.p-med{color:#fbbf24}.p-low{color:#8898aa}
          .freq{font-size:.72rem;background:rgba(255,255,255,.06);border-radius:4px;padding:2px 7px;color:#8898aa}
          .img-icon{color:#4ade80;font-size:.75rem}
          .footer{margin-top:32px;padding-top:16px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-size:.75rem;color:#8898aa}
          .footer a{color:#38bdf8;text-decoration:none}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="header">
            <div class="logo">Prompt<span>Image</span>Lab</div>
            <div class="badge">XML Sitemap</div>
          </div>

          <h1>XML Sitemap</h1>
          <p class="sub">
            This sitemap is read by search engine crawlers (Google, Bing). It lists all public pages of
            <a href="https://promptimagelab.com" style="color:#38bdf8">promptimagelab.com</a>.
            Submit it in <a href="https://search.google.com/search-console" style="color:#38bdf8" target="_blank" rel="nofollow">Google Search Console</a>.
          </p>

          <div class="stats">
            <div class="stat">
              <div class="stat-val"><xsl:value-of select="count(sm:urlset/sm:url)"/></div>
              <div class="stat-lbl">Total URLs</div>
            </div>
            <div class="stat">
              <div class="stat-val"><xsl:value-of select="count(sm:urlset/sm:url[sm:priority &gt;= 0.9])"/></div>
              <div class="stat-lbl">High Priority</div>
            </div>
            <div class="stat">
              <div class="stat-val"><xsl:value-of select="count(sm:urlset/sm:url[image:image])"/></div>
              <div class="stat-lbl">With Images</div>
            </div>
            <div class="stat">
              <div class="stat-val"><xsl:value-of select="count(sm:urlset/sm:url[sm:changefreq='daily' or sm:changefreq='weekly'])"/></div>
              <div class="stat-lbl">Updated Often</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sm:urlset/sm:url">
                <xsl:sort select="sm:priority" order="descending" data-type="number"/>
                <tr>
                  <td>
                    <a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a>
                  </td>
                  <td><xsl:value-of select="sm:lastmod"/></td>
                  <td><span class="freq"><xsl:value-of select="sm:changefreq"/></span></td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sm:priority &gt;= 0.9"><span class="p-high"><xsl:value-of select="sm:priority"/></span></xsl:when>
                      <xsl:when test="sm:priority &gt;= 0.6"><span class="p-med"><xsl:value-of select="sm:priority"/></span></xsl:when>
                      <xsl:otherwise><span class="p-low"><xsl:value-of select="sm:priority"/></span></xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <xsl:if test="image:image">
                      <span class="img-icon">&#10003; Image</span>
                    </xsl:if>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="footer">
            Generated dynamically by <a href="https://promptimagelab.com">PromptImageLab</a> ·
            <a href="https://search.google.com/search-console" target="_blank" rel="nofollow">Submit to Google Search Console</a> ·
            <a href="https://www.bing.com/webmasters" target="_blank" rel="nofollow">Submit to Bing Webmaster</a>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
