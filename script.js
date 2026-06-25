/* ═══════════════════════════════════════════════════════════
   AKTE LAB — script.js
   Nav toggle · Sticky header · FAQ accordion · Scroll animations
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Sticky header shadow ── */
  const header = document.querySelector('.header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-item__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer    = btn.nextElementSibling;
      const expanded  = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item__q').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      answer.classList.toggle('open', !expanded);
    });
  });

  /* ── Scroll-triggered fade-in ── */
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.sphere-card, .step-card, .actor-card, .soon-card, ' +
      '.identify-tag, .stat-block, .bilan-main-card, .rp-card, ' +
      '.mockup-card, .tarif-card, .parcours__text, .approach__block, ' +
      '.rapport__text, .apropos__text, .section-title, .section-intro'
    );

    targets.forEach(function (el) {
      el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver(
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

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
