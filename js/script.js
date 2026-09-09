/* ==========================================
   GLORIA GAO — PORTFOLIO WEBSITE
   ==========================================
   Small, self-contained interactions:
   1. Preloader — counts 0 → 100% then slides away
   2. Scroll reveals — sections fade/rise in as you scroll to them
   3. Custom cursor — a ring that follows the mouse (desktop only)
   4. Page transition — a color "curtain" wipes up before leaving the page
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ---------- 1. Preloader ---------- */
  const preloader = $('[data-preloader]');
  const counter = $('[data-count]');
  const bar = $('[data-bar]');
  const duration = 1200;
  const start = performance.now();

  function finishPreload() {
    if (preloader) {
      preloader.classList.add('is-done');
      setTimeout(() => { preloader.style.display = 'none'; }, 850);
    }
    $$('[data-hero]').forEach((el) => el.classList.add('is-visible'));
  }

  function tickPreload(now) {
    const progress = Math.min(1, (now - start) / duration);
    if (counter) counter.textContent = Math.floor(progress * 100);
    if (bar) bar.style.width = (progress * 100) + '%';
    if (progress < 1) {
      requestAnimationFrame(tickPreload);
    } else {
      finishPreload();
    }
  }
  requestAnimationFrame(tickPreload);

  /* ---------- 2. Scroll reveals ---------- */
  const revealTargets = $$('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 3. Custom cursor ---------- */
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    const ring = $('[data-cursor-ring]');
    const dot = $('[data-cursor-dot]');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function followCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(followCursor);
    }
    followCursor();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button')) ring && ring.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button')) ring && ring.classList.remove('is-active');
    });
  }

  /* ---------- 4. Page transition curtain ---------- */
  const curtain = $('[data-curtain]');
  $$('a[data-transition]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
      e.preventDefault();
      if (curtain) curtain.classList.add('is-active');
      setTimeout(() => { window.location.href = href; }, 640);
    });
  });
  window.addEventListener('pageshow', () => {
    if (curtain) curtain.classList.remove('is-active');
  });
});
