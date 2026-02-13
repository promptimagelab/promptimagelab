// Image handling utility to reliably hide broken images
(function() {
  /**
   * global capture-phase error listener
   * 'error' events on <img> tags do not bubble, so we must use capture: true.
   */
  window.addEventListener('error', function(event) {
    if (event.target && event.target.tagName === 'IMG') {
      // Hide the broken image to prevent the default browser icon
      event.target.classList.add('img-hidden');
    }
  }, true);

  /**
   * Check for images that may have already failed before this script executed
   */
  function hideAlreadyBrokenImages() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      // If image is complete but has 0 natural width, it failed to load
      // Also hide if src is missing entirely
      if ((img.complete && img.naturalWidth === 0) || !img.getAttribute('src')) {
        img.classList.add('img-hidden');
      }
    });
  }

  // Run immediately in case script loaded after images
  hideAlreadyBrokenImages();

  // Run again on DOMContentLoaded to catch any stragglers
  window.addEventListener('DOMContentLoaded', hideAlreadyBrokenImages);
  
  // Optional: Run on window load for final cleanup
  window.addEventListener('load', hideAlreadyBrokenImages);

})();
