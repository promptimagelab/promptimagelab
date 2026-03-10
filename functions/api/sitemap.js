/**
 * Legacy redirect — forwards /api/sitemap to /sitemap.xml
 * The canonical sitemap is now served by /functions/sitemap.xml.js
 */
export async function onRequestGet() {
  return Response.redirect('https://promptimagelab.com/sitemap.xml', 301);
}
