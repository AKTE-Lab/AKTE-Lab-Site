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

/* ═══════════════════════════════════════════════════════════
   AKTE LAB — Consentement Analytics et suivi Calendly
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-BEEHK8QX56';
  const CONSENT_STORAGE_KEY = 'akte_analytics_consent';

  let analyticsLoaded = false;

  function initializeDataLayer() {
    window.dataLayer = window.dataLayer || [];

    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
  }

  function loadGoogleAnalytics() {
    if (analyticsLoaded) {
      return;
    }

    initializeDataLayer();

    /*
     * Consentement refusé par défaut, puis accordé immédiatement
     * puisque cette fonction n'est appelée qu'après acceptation.
     */
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    const googleScript = document.createElement('script');
    googleScript.async = true;
    googleScript.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_MEASUREMENT_ID);
    googleScript.dataset.akteAnalytics = 'true';

    document.head.appendChild(googleScript);

    window.gtag('js', new Date());

    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    });

    analyticsLoaded = true;
  }

  function showConsentBanner() {
    const banner = document.getElementById('cookieBanner');

    if (banner) {
      banner.classList.add('is-visible');
    }
  }

  function hideConsentBanner() {
    const banner = document.getElementById('cookieBanner');

    if (banner) {
      banner.classList.remove('is-visible');
    }
  }

  function acceptAnalytics() {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    loadGoogleAnalytics();
    hideConsentBanner();
  }

  function refuseAnalytics() {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'refused');
    hideConsentBanner();
  }

  function resetAnalyticsChoice() {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    showConsentBanner();
  }

  function trackCalendlyClick(link) {
    if (!analyticsLoaded || typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', 'calendly_click', {
      event_category: 'engagement',
      event_label: link.textContent.trim(),
      link_url: link.href,
      transport_type: 'beacon'
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    const acceptButton = document.getElementById('acceptCookies');
    const refuseButton = document.getElementById('refuseCookies');
    const manageButton = document.getElementById('manageCookies');

    if (savedConsent === 'accepted') {
      loadGoogleAnalytics();
    } else if (savedConsent !== 'refused') {
      showConsentBanner();
    }

    if (acceptButton) {
      acceptButton.addEventListener('click', acceptAnalytics);
    }

    if (refuseButton) {
      refuseButton.addEventListener('click', refuseAnalytics);
    }

    if (manageButton) {
      manageButton.addEventListener('click', resetAnalyticsChoice);
    }

    document.addEventListener('click', function (event) {
      const calendlyLink = event.target.closest(
        'a[href*="calendly.com/contact-aktelab"]'
      );

      if (calendlyLink) {
        trackCalendlyClick(calendlyLink);
      }
    });
  });
})();
