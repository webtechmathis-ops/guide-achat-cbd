/* ============================================================
   GUIDE ACHAT CBD — script.js
   Vanilla JS minimal : cookie consent, menu mobile, reveal, TOC
   ============================================================ */

(function () {
  'use strict';

  /* ---- Cookie Consent ---- */
  function cookieConsent(choice) {
    localStorage.setItem('cookie-consent', choice);
    var banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
  }

  window.cookieConsent = cookieConsent;

  function initCookieBanner() {
    if (!localStorage.getItem('cookie-consent')) {
      var banner = document.getElementById('cookieBanner');
      if (banner) banner.style.display = 'flex';
    }
  }

  /* ---- Mobile Menu ---- */
  function initMobileMenu() {
    var btn = document.getElementById('menuBtn');
    var nav = document.getElementById('navMobile');
    var closeBtn = document.getElementById('menuClose');
    if (!btn || !nav) return;

    function openMenu() {
      nav.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });

    // Close on outside click
    nav.addEventListener('click', function (e) {
      if (e.target === nav) closeMenu();
    });
  }

  /* ---- Reveal on Scroll ---- */
  function observeReveal(elements) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    elements.forEach(function (el) { observer.observe(el); });
  }

  function initReveal() {
    observeReveal(Array.from(document.querySelectorAll('.reveal')));
  }

  /* ---- TOC Active State ---- */
  function initTOC() {
    var tocLinks = document.querySelectorAll('.toc a');
    if (!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      var el = document.getElementById(id);
      if (el) headings.push(el);
    });

    if (!headings.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (link) {
            link.classList.remove('active');
          });
          var activeLink = document.querySelector('.toc a[href="#' + entry.target.id + '"]');
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, {
      rootMargin: '-' + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 16) + 'px 0px -60% 0px'
    });

    headings.forEach(function (h) { observer.observe(h); });
  }

  /* ---- Dynamic Year in Footer ---- */
  function initYear() {
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Reading Time ---- */
  function initReadingTime() {
    var content = document.querySelector('.content');
    var rtEl = document.getElementById('readingTime');
    if (!content || !rtEl) return;
    var words = content.innerText.trim().split(/\s+/).length;
    var minutes = Math.max(1, Math.ceil(words / 250));
    rtEl.textContent = minutes + ' min de lecture';
  }

  /* ---- Staggered card animations ---- */
  function initStagger() {
    var grids = document.querySelectorAll('.hubs-grid, .articles-grid, .related-grid');
    var newRevealEls = [];
    grids.forEach(function (grid) {
      var cards = grid.querySelectorAll('.hub-card, .article-card');
      cards.forEach(function (card, i) {
        card.style.transitionDelay = (i * 60) + 'ms';
        if (!card.classList.contains('reveal')) {
          card.classList.add('reveal');
          newRevealEls.push(card);
        }
      });
    });
    // Observer les nouvelles cards ajoutées par stagger
    if (newRevealEls.length) observeReveal(newRevealEls);
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initCookieBanner();
    initMobileMenu();
    initReveal();
    initTOC();
    initYear();
    initReadingTime();
    initStagger();
  });

})();
