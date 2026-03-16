/* ============================================================
   ShopSummary Landing Page — main.js
   Vanilla JS: FAQ accordion, scroll reveal, mobile nav,
   smooth anchor scrolling, sticky nav
============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // FAQ ACCORDION
  // ----------------------------------------------------------
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var question = item.querySelector('.faq-item__question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('open');
          var q = other.querySelector('.faq-item__question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Toggle this
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ----------------------------------------------------------
  // SCROLL REVEAL
  // ----------------------------------------------------------
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ----------------------------------------------------------
  // MOBILE NAV TOGGLE
  // ----------------------------------------------------------
  function initMobileNav() {
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----------------------------------------------------------
  // SMOOTH ANCHOR SCROLLING
  // ----------------------------------------------------------
  function initSmoothScroll() {
    var navHeight = 68;

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
    var nav = document.getElementById('nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 8) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    initFAQ();
    initScrollReveal();
    initMobileNav();
    initSmoothScroll();
    initNavScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
