/* ============================================================
   PromptImageLab — Browser Script
   Handles: broken images, copy-to-clipboard, mobile nav,
            scroll reveal, copy toast notification
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. MOBILE NAVIGATION TOGGLE
     ---------------------------------------------------------- */

  function wireNavToggle(toggleId, linksId) {
    var toggle = document.getElementById(toggleId);
    var links  = document.getElementById(linksId);
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('nav-open');
      toggle.classList.toggle('active');
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('nav-open');
        toggle.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireNavToggle('nav-toggle',     'nav-links');     /* Main pages */
    wireNavToggle('nav-toggle-404', 'nav-links-404'); /* 404 page   */
  });


  /* ----------------------------------------------------------
     2. COPY PROMPT TO CLIPBOARD
        Unified toast — no more alert()
     ---------------------------------------------------------- */

  window.copyText = function (id) {

    var el = document.getElementById(id);
    if (!el) return;

    var text = el.innerText || el.textContent || '';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('✓ Prompt copied to clipboard!');
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }

  };

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('✓ Prompt copied!'); }
    catch (e) { showToast('Could not copy — please copy manually.'); }
    document.body.removeChild(ta);
  }

  function showToast(message) {
    /* Remove existing toast if any */
    var old = document.getElementById('pil-toast');
    if (old) old.remove();

    var toast        = document.createElement('div');
    toast.id         = 'pil-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.style.cssText =
      'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:rgba(34,197,94,0.95);color:#000;padding:12px 28px;' +
      'border-radius:24px;font-weight:700;font-size:0.95rem;' +
      'box-shadow:0 8px 32px rgba(34,197,94,0.3);z-index:9999;' +
      'opacity:0;transition:opacity 0.25s ease,transform 0.25s ease;' +
      'pointer-events:none;white-space:nowrap;';

    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });
    });

    setTimeout(function () {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
    }, 2500);
  }


  /* ----------------------------------------------------------
     3. BROKEN IMAGE HANDLER
     ---------------------------------------------------------- */

  /* Capture-phase listener — error events on <img> don't bubble */
  window.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'IMG') {
      event.target.classList.add('img-hidden');
    }
  }, true);

  function hideAlreadyBrokenImages() {
    var imgs = document.querySelectorAll('img');
    imgs.forEach(function (img) {
      if ((img.complete && img.naturalWidth === 0) || !img.getAttribute('src')) {
        img.classList.add('img-hidden');
      }
    });
  }

  hideAlreadyBrokenImages();
  document.addEventListener('DOMContentLoaded', hideAlreadyBrokenImages);
  window.addEventListener('load', hideAlreadyBrokenImages);


  /* ----------------------------------------------------------
     4. SCROLL REVEAL FOR CARDS
     ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.IntersectionObserver) return;

    var cards = document.querySelectorAll('.card');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  });


  /* ----------------------------------------------------------
     5. ACTIVE NAV LINK HIGHLIGHT
     ---------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    var path  = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path || (path === '/' && href === '/')) {
        link.setAttribute('aria-current', 'page');
        link.style.color = 'var(--text)';
      }
    });
  });

}());
