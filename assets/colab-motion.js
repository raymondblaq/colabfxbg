/* CoLab FXBG — scroll reveals + header elevation (progressive enhancement) */
(function () {
  'use strict';

  document.documentElement.classList.add('colab-js');

  var header = document.querySelector('.colab-site-header');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  var selector = [
    '.colab-card',
    '.colab-quote',
    '.colab-stat',
    '.colab-tile-link',
    '.colab-header',
    '.colab-header--left',
    '.colab-hero-panel',
    '.colab-page-card',
    '.colab-newsletter',
    '.colab-visual-panel',
    '.colab-faq details',
    '.colab-split > div:not([class])'
  ].join(', ');

  var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
  // Skip elements nested inside another reveal target (e.g. cards within cards)
  targets = targets.filter(function (el) {
    var parent = el.parentElement;
    while (parent) {
      if (targets.indexOf(parent) !== -1) return false;
      parent = parent.parentElement;
    }
    return true;
  });

  var viewportBottom = window.innerHeight;
  targets = targets.filter(function (el) {
    // Elements already at or above the fold render instantly — never hide
    // what the visitor can currently see.
    if (el.getBoundingClientRect().top < viewportBottom) return false;
    el.classList.add('colab-reveal');
    return true;
  });

  var observer = new IntersectionObserver(function (entries) {
    var delay = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.style.setProperty('--colab-reveal-delay', delay + 'ms');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      delay += 70;
    });
  }, { rootMargin: '0px 0px 18% 0px', threshold: 0.01 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
