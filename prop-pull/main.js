// ── FAQ accordion ────────────────────────────────────────────────────────────

document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach((el) => el.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ── Smooth-reveal on scroll ──────────────────────────────────────────────────

const revealEls = document.querySelectorAll(
  '.pain-card, .feature-card, .step, .audience-card, .pricing-card, .faq-item'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => {
  el.classList.add('reveal-ready');
  observer.observe(el);
});

// ── Nav active link ──────────────────────────────────────────────────────────

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => navObserver.observe(s));

// ── CTA placeholder alert ────────────────────────────────────────────────────

['cta-free', 'cta-pro', 'cta-bottom'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // Replace with real Chrome Web Store URL once published
      alert('Coming soon! The extension is in review on the Chrome Web Store.\nEnter your email at hello@proppull.com to be notified at launch.');
    });
  }
});
