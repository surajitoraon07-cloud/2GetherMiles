/* ===================================================
   2GetherMiles – JavaScript
   Features: Navbar shrink, scroll reveal, stat counter,
             parallax fallback, mobile menu, FAQ, form,
             scroll-to-top
   =================================================== */

'use strict';

/* ── Navbar: scroll-driven fallback ── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Only run JS fallback if CSS scroll-driven animations are NOT supported
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const SCROLL_THRESHOLD = 80;
    function updateNav() {
      navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }
})();

/* ── Mobile Nav Toggle ── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  let overlay = null;

  function ensureOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:998;background:rgba(5,16,9,0.5);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity 0.25s ease;';
      overlay.addEventListener('click', closeMenu);
      document.body.appendChild(overlay);
    }
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
    ensureOverlay();
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 220);
      overlay = null;
    }
  }

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('open')) {
      closeMenu();
    }
  });
})();

/* ── Scroll Reveal (IntersectionObserver) ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── Animated Stat Counters ── */
(function () {
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  if (!statEls.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
})();

/* ── Parallax fallback (for browsers without scroll-driven animations) ── */
(function () {
  if (CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const wrapper = document.querySelector('.hero-parallax-wrapper');
  if (!wrapper) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY   = window.scrollY;
        const vh        = window.innerHeight;
        // Move background 15% of scroll within hero
        const pct = Math.min(scrollY / vh, 1);
        wrapper.style.transform = `translateY(${pct * 10}%)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Scroll-to-top button ── */
(function () {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  function toggle() {
    const show = window.scrollY > 400;
    if (show) btn.removeAttribute('hidden');
    else      btn.setAttribute('hidden', '');
  }

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  toggle();
})();

/* ── Active nav link on scroll ── */
(function () {
  const sections = document.querySelectorAll('section[id], main section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Contact Form Submission ── */
(function () {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.focus();
        valid = false;
      }
    });
    if (!valid) return;

    const submitBtn = document.getElementById('form-submit-btn');
    form.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate async submission (replace with real API call)
    await new Promise(resolve => setTimeout(resolve, 1800));

    form.classList.remove('loading');

    // Show success state
    form.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;display:flex;flex-direction:column;align-items:center;gap:1.25rem;">
        <div style="font-size:4rem;animation:fadeUp 0.5s ease forwards;">✈️</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--green-900);">Enquiry Sent!</h3>
        <p style="color:var(--gray-600);max-width:32ch;line-height:1.7;">
          Thank you for reaching out! Our travel experts will contact you within 24 hours with your personalized itinerary. Get ready for an amazing adventure! 🏔️❤️
        </p>
      </div>
    `;
  });
})();

/* ── Smooth anchor scroll with navbar offset ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height-short')) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Add active style for nav ── */
(function() {
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--gold-300) !important; }`;
  document.head.appendChild(style);
})();
