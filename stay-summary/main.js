/* ============================================================
   StaySummary Landing Page — main.js
   Vanilla JS: CTA alerts, FAQ accordion, scroll reveal,
   mobile nav, smooth anchor scrolling
============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // CTA CLICK HANDLER
  // All .cta-trigger elements show the store notification alert
  // ----------------------------------------------------------
  function initCTAs() {
    const triggers = document.querySelectorAll('.cta-trigger');
    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        alert(
          'StaySummary is live on the Chrome Web Store!\n\n' +
          'Get notified at hello@staysummary.io'
        );
      });
    });
  }

  // ----------------------------------------------------------
  // FAQ ACCORDION
  // Clicking a question toggles its answer open/closed.
  // Only one question can be open at a time.
  // ----------------------------------------------------------
  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      const inner    = item.querySelector('.faq-answer-inner');

      if (!question || !answer || !inner) return;

      question.addEventListener('click', function () {
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        // Close all other open items
        items.forEach(function (other) {
          if (other === item) return;
          const otherQ = other.querySelector('.faq-question');
          const otherA = other.querySelector('.faq-answer');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherA) otherA.style.maxHeight = '0';
        });

        // Toggle this item
        if (isOpen) {
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
        } else {
          question.setAttribute('aria-expanded', 'true');
          // Use scrollHeight of inner content so the transition is accurate
          answer.style.maxHeight = inner.scrollHeight + 32 + 'px';
        }
      });
    });
  }

  // ----------------------------------------------------------
  // SCROLL REVEAL
  // Elements with class .reveal animate in when they enter
  // the viewport via IntersectionObserver.
  // ----------------------------------------------------------
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything immediately
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ----------------------------------------------------------
  // MOBILE NAV TOGGLE
  // ----------------------------------------------------------
  function initMobileNav() {
    var hamburger  = document.querySelector('.nav-hamburger');
    var mobileMenu = document.querySelector('.nav-mobile-menu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------
  // SMOOTH ANCHOR SCROLLING
  // Offsets scroll position to account for sticky nav height
  // ----------------------------------------------------------
  function initSmoothScroll() {
    var navHeight = 64; // matches CSS --nav height

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  // ----------------------------------------------------------
  // STICKY NAV — add shadow class on scroll
  // ----------------------------------------------------------
  function initNavScroll() {
    var nav = document.querySelector('.nav-wrapper');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 8) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ----------------------------------------------------------
  // EXTENSION PANEL — tab interaction in hero mockup
  // ----------------------------------------------------------
  function initExtTabs() {
    var tabs = document.querySelectorAll('.ext-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('ext-tab-active'); });
        tab.classList.add('ext-tab-active');
      });
    });
  }

  // ----------------------------------------------------------
  // INIT — run everything on DOMContentLoaded
  // ----------------------------------------------------------
  function init() {
    initCTAs();
    initFAQ();
    initScrollReveal();
    initMobileNav();
    initSmoothScroll();
    initNavScroll();
    initExtTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
