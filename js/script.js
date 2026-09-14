/* ==========================================
   GLORIA GAO — PORTFOLIO WEBSITE
   ==========================================
   Small, self-contained interactions:
   1. Preloader — counts 0 → 100% then slides away
   2. Scroll reveals — sections fade/rise in as you scroll to them
   3. Custom cursor — a ring that follows the mouse (desktop only)
   4. Rotating banner — the hero image strip drifts left as you scroll
   5. Case study parallax — each fold's shape and mockup drift at
      different speeds for a depth effect
   6. Case study scroll-scrub (folds 1 & 2) — shape/mockup/content track
      scroll position directly, reversible in both directions
   7. Case study side nav — "On this page" list highlights the section
      you're currently reading (case-*.html only)
   8. Page transition — a color "curtain" wipes up before leaving the page
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  /* ---------- 1. Preloader ----------
     Plays only on the first page of a visit. A tiny inline script right
     after the preloader markup in <head> (see every page's <body>) sets
     .skip-preloader on <html> — before first paint, so there's no flash —
     once sessionStorage confirms this isn't that first page. When skipped,
     the count/bar animation never runs; hero content still reveals right
     away rather than staying invisible waiting for a countdown that isn't
     happening. */
  const preloader = $('[data-preloader]');
  const counter = $('[data-count]');
  const bar = $('[data-bar]');
  const skippedPreload = document.documentElement.classList.contains('skip-preloader');

  function finishPreload() {
    if (preloader && !skippedPreload) {
      preloader.classList.add('is-done');
      setTimeout(() => { preloader.style.display = 'none'; }, 850);
    }
    $$('[data-hero]').forEach((el) => el.classList.add('is-visible'));
  }

  if (skippedPreload) {
    finishPreload();
  } else {
    const duration = 1200;
    const start = performance.now();
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
  }

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

  /* About me's grid lines + stat blocks reveal together as one group,
     separate from the generic fade above — lines grow down, text slides up. */
  const statsReveal = $('[data-stats-reveal]');
  if (statsReveal) {
    const gridBg = document.querySelector('.about-grid-bg');
    const revealGroup = () => {
      statsReveal.classList.add('is-visible');
      if (gridBg) gridBg.classList.add('is-visible');
    };
    if ('IntersectionObserver' in window) {
      const ioStats = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealGroup();
            ioStats.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
      ioStats.observe(statsReveal);
    } else {
      revealGroup();
    }
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

  /* ---------- 4. Rotating banner — drifts left as you scroll ---------- */
  const bannerTrack = $('[data-banner-track]');
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (bannerTrack && bannerTrack.children.length && !reducedMotion) {
    const panelCount = bannerTrack.children.length;
    const sequenceLength = panelCount / 2; // track holds two back-to-back copies for a seamless loop
    const SPEED = 0.6; // px of drift per px scrolled

    function tickBanner() {
      const panelWidth = bannerTrack.children[0].getBoundingClientRect().width;
      const sequenceWidth = panelWidth * sequenceLength;
      if (sequenceWidth > 0) {
        const offset = (window.scrollY * SPEED) % sequenceWidth;
        bannerTrack.style.transform = `translateX(${-offset}px)`;
      }
      requestAnimationFrame(tickBanner);
    }
    requestAnimationFrame(tickBanner);
  }

  /* ---------- 5. Case study parallax ----------
     The shape sits further "back" (slow) and the mockup sits further
     "front" (faster) — same drift-toward-viewport-center math as the
     rotating banner, just applied per element instead of to one track. */
  const parallaxLayers = $$('[data-parallax]');
  const parallaxQuery = window.matchMedia('(min-width: 861px)');
  if (parallaxLayers.length && !reducedMotion) {
    function tickCaseParallax() {
      if (parallaxQuery.matches) {
        const viewportMid = window.innerHeight / 2;
        parallaxLayers.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0;
          const rect = el.getBoundingClientRect();
          const elMid = rect.top + rect.height / 2;
          const offset = (viewportMid - elMid) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
      } else {
        parallaxLayers.forEach((el) => { el.style.transform = ''; });
      }
      requestAnimationFrame(tickCaseParallax);
    }
    requestAnimationFrame(tickCaseParallax);
  }

  /* ---------- 6. Case study scroll-scrub (folds 1–4) ----------
     Progress (0–1) is a direct function of a fold's current position — 0
     when it's just entering from the bottom of the screen, 1 once it
     fully fills the viewport — recomputed every frame from scratch, so
     scrolling back up genuinely reverses it rather than replaying a
     one-time entrance. Any [data-scroll-fold] gets the same treatment.
     Each shape picks one growth axis via its data attribute:
     - data-scroll-grow: uniform scale from center (case study 1's circle)
     - data-scroll-grow-x-right: from the right edge, growing leftward
       (case studies 3 & 4)
     - data-scroll-clip-y: case study 2's shape only — see the clip-path
       comment in styles.css for why this one is a different mechanism
       (it grows in AND shrinks back out, both bottom-to-top, which needs
       two independently-driven edges rather than one scale + one anchor)
     Desktop only, same gate as the parallax above. */
  const GROW_ATTRS = {
    'data-scroll-grow': (p) => `scale(${p})`,
    'data-scroll-grow-x-right': (p) => `scaleX(${p})`,
  };
  const growSelector = Object.keys(GROW_ATTRS).map((a) => `[${a}]`).concat('[data-scroll-clip-y]').join(', ');

  function initScrollScrub(fold) {
    const growGroups = Object.entries(GROW_ATTRS).map(([attr, toTransform]) => ({
      els: fold.querySelectorAll(`[${attr}]`),
      toTransform,
    }));
    const clipYEls = fold.querySelectorAll('[data-scroll-clip-y]');
    const slideEls = fold.querySelectorAll('[data-scroll-slide]');
    const fadeEls = fold.querySelectorAll('[data-scroll-fade]');

    function tickCaseScrub() {
      if (parallaxQuery.matches) {
        const vh = window.innerHeight;
        const rect = fold.getBoundingClientRect();
        // entryProgress: 0 while still below the viewport, 1 once the fold's
        // top has reached the viewport's top. exitAmount: 0 until that same
        // point, then rises toward 1 as you keep scrolling the fold further
        // past the top — both are pure functions of rect.top, so scrolling
        // back up unwinds either one exactly, no separate state needed.
        const entryProgress = Math.min(1, Math.max(0, 1 - rect.top / vh));
        const exitAmount = Math.min(1, Math.max(0, -rect.top / vh));
        growGroups.forEach(({ els, toTransform }) => {
          els.forEach((el) => { el.style.transform = toTransform(entryProgress); });
        });
        clipYEls.forEach((el) => {
          const topInset = (1 - entryProgress) * 100;
          const bottomInset = exitAmount * 100;
          el.style.clipPath = `inset(${topInset}% 0 ${bottomInset}% 0)`;
        });
        slideEls.forEach((el) => {
          // A .case-mockup--bare slide has no backing — it's a transparent
          // screenshot PNG with nothing behind it but the shape it overlaps.
          // Fading ITS opacity would fade the screenshot's own pixels, which
          // lets that shape show through mid-scale-in — its still-growing
          // edge then reads as a hard line cutting across the laptop. Held
          // at 1 instead (never the CSS resting-state 0), so only the slide
          // itself animates and the image is opaque throughout.
          el.style.opacity = el.closest('.case-mockup--bare') ? 1 : entryProgress;
          el.style.transform = `translateX(${(1 - entryProgress) * 48}px)`;
        });
        fadeEls.forEach((el) => {
          el.style.opacity = entryProgress;
          el.style.transform = `translateY(${(1 - entryProgress) * 20}px)`;
        });
      } else {
        growGroups.forEach(({ els }) => { els.forEach((el) => { el.style.transform = ''; }); });
        clipYEls.forEach((el) => { el.style.clipPath = ''; });
        slideEls.forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
        fadeEls.forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
      }
      requestAnimationFrame(tickCaseScrub);
    }
    requestAnimationFrame(tickCaseScrub);
  }

  const scrollFolds = $$('[data-scroll-fold]');
  if (!reducedMotion) {
    scrollFolds.forEach(initScrollScrub);
  } else {
    // Reduced-motion: skip the scroll-scrub entirely, just show everything at rest.
    scrollFolds.forEach((fold) => {
      fold.querySelectorAll(`${growSelector}, [data-scroll-slide], [data-scroll-fade]`).forEach((el) => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      fold.querySelectorAll('[data-scroll-clip-y]').forEach((el) => { el.style.clipPath = 'none'; });
    });
  }

  /* ---------- 7. Case study side nav ----------
     Marks whichever section you're currently reading. A section counts as
     current once its top passes a line a third of the way down the screen,
     so the highlight changes as a heading settles into view rather than the
     instant it appears at the bottom. */
  const sideNav = $('[data-sidenav]');
  if (sideNav) {
    const navLinks = Array.from(sideNav.querySelectorAll('a[href^="#"]'));
    const navSections = navLinks
      .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    let navTicking = false;
    function updateSideNav() {
      navTicking = false;
      const line = window.innerHeight / 3;
      let active = 0;
      navSections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line) active = i;
      });
      navLinks.forEach((a, i) => a.classList.toggle('is-active', i === active));
    }

    window.addEventListener('scroll', () => {
      if (!navTicking) {
        navTicking = true;
        requestAnimationFrame(updateSideNav);
      }
    }, { passive: true });
    updateSideNav();
  }

  /* ---------- 8. Page transition curtain ----------
     Always upward, never back down the way it came: rises from below to
     cover the screen (ease-out, 500ms) before navigating away, then —
     once the destination page has loaded — keeps rising up and off the
     top to reveal it (ease-in, 500ms). Positions/easing live in CSS (see
     .curtain / .is-active / .is-exiting in styles.css); this is just the
     choreography of when each class applies.

     The destination page needs to START already covering the screen, or
     there's nothing to reveal from. A sessionStorage flag set right
     before navigating tells that page's own early inline script (right
     after its curtain markup in <body>) to add .is-active before first
     paint, with no animation — the same no-flash technique the preloader
     skip uses. This block waits for that painted state to actually commit
     before reversing it — toggling classes in the same tick they were set
     can get coalesced by the browser into a no-op, skipping the
     transition, so a double rAF forces a real frame in between — then,
     once the reveal has had its full 500ms to play, resets the curtain
     straight back to resting-below with transitions suspended for a beat,
     so nothing visibly moves (both positions are off-screen either way)
     and it's ready to rise from below again next time. */
  const curtain = $('[data-curtain]');

  function resetCurtainInstant() {
    if (!curtain) return;
    curtain.classList.add('no-transition');
    curtain.classList.remove('is-active', 'is-exiting');
    void curtain.offsetHeight; // force layout so the reset above lands before transitions come back
    curtain.classList.remove('no-transition');
  }

  $$('a[data-transition]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
      e.preventDefault();
      sessionStorage.setItem('gg-curtain-incoming', '1');
      if (curtain) {
        curtain.classList.remove('is-exiting');
        curtain.classList.add('is-active');
      }
      setTimeout(() => { window.location.href = href; }, 500);
    });
  });
  if (curtain && curtain.classList.contains('is-active')) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        curtain.classList.remove('is-active');
        curtain.classList.add('is-exiting');
        setTimeout(resetCurtainInstant, 500);
      });
    });
  }
  window.addEventListener('pageshow', (event) => {
    // Only the bfcache-restore case (browser back/forward — event.persisted
    // is true only then): the page reappears without DOMContentLoaded
    // firing again, so the block above never ran on it. Resetting
    // unconditionally here instead would fire on every ordinary load too,
    // racing that block and potentially cutting its reveal short.
    if (event.persisted) resetCurtainInstant();
  });

  /* ---------- 9. About page — portrait parallax ----------
     Turns the pointer's position into a -1..1 pair on the stage. Each layer
     inside multiplies that by its own data-depth (set in the HTML), so the
     square, circle and photo drift different distances and the group reads
     as depth rather than one flat picture.

     Guards: skipped entirely on touch devices (nothing hovers) and when the
     reader has asked for reduced motion. With JS off the transforms resolve
     to zero, so the composition still sits exactly where it should. */
  const portrait = $('[data-portrait]');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const stillPreferred = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (portrait && canHover && !stillPreferred) {
    // Scoped to the stage — $$ above is document-wide and takes no root.
    const layers = Array.from(portrait.querySelectorAll('[data-depth]'));
    layers.forEach((el) => el.style.setProperty('--d', el.dataset.depth));

    let queued = false;
    let pending = { x: 0, y: 0 };

    const apply = () => {
      queued = false;
      portrait.style.setProperty('--px', pending.x.toFixed(3));
      portrait.style.setProperty('--py', pending.y.toFixed(3));
    };

    // Track across the whole header so the shapes react as you approach,
    // not only once the cursor is inside the photo itself.
    const zone = portrait.closest('.about-header') || portrait;

    zone.addEventListener('mousemove', (e) => {
      const r = zone.getBoundingClientRect();
      pending.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pending.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });

    zone.addEventListener('mouseleave', () => {
      pending = { x: 0, y: 0 };
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }
});
