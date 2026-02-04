// Hide broken images and prevent broken-image icon from showing.
document.addEventListener('DOMContentLoaded', function () {
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    // hide immediately if src is empty
    if (!img.getAttribute('src')) {
      img.classList.add('img-hidden');
      return;
    }
    // Hide the image element when it fails to load
    img.addEventListener('error', function () {
      img.classList.add('img-hidden');
    });
    // Optional: hide until loaded to avoid layout flash
    img.addEventListener('load', function () {
      img.classList.remove('img-hidden');
    });
  });
});

// NOTE: If you want images to auto-appear when a file is uploaded to the same path,
// the page needs to be refreshed or polling must be enabled. Polling is intentionally
// not enabled by default to avoid extra requests; I can add it if you'd like.

// Polling: periodically re-check hidden images to auto-show them when they become available.
// Configuration
const IMAGE_POLLING = true; // set false to disable polling
const POLL_INTERVAL_MS = 30 * 1000; // 30s between checks
const MAX_POLL_ATTEMPTS = 60; // stop after this many attempts per image

if (IMAGE_POLLING) {
  const pollMap = new WeakMap();
  setInterval(() => {
    const hiddenImgs = document.querySelectorAll('img.img-hidden');
    hiddenImgs.forEach(img => {
      const attempts = pollMap.get(img) || 0;
      if (attempts >= MAX_POLL_ATTEMPTS) return;
      const testSrc = img.getAttribute('src');
      if (!testSrc) return;
      // Try loading a fresh copy (bust cache)
      const probe = new Image();
      const url = testSrc + (testSrc.includes('?') ? '&' : '?') + '_probe=' + Date.now();
      probe.onload = () => {
        // image is available now — show it
        img.classList.remove('img-hidden');
        // replace src to ensure browser displays the loaded image
        try { img.src = url; } catch (e) {}
        pollMap.delete(img);
      };
      probe.onerror = () => {
        pollMap.set(img, attempts + 1);
      };
      probe.src = url;
    });
  }, POLL_INTERVAL_MS);
}
