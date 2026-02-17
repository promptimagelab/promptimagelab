addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  // 1) index.html -> /
  if (pathname === '/index.html') {
    return Response.redirect(origin + '/', 301);
  }

  // 2) If path has no extension and not root, check if path + .html exists and redirect
  if (!pathname.includes('.') && pathname !== '/') {
    const candidate = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    try {
      // HEAD to check existence
      const res = await fetch(origin + candidate + '.html', { method: 'HEAD' });
      if (res.status === 200) {
        return Response.redirect(origin + candidate + '.html', 301);
      }
    } catch (e) {
      // network or origin error — fallthrough to fetch
    }
  }

  // otherwise, pass through
  return fetch(request);
}

// End Cloudflare Worker redirect script
