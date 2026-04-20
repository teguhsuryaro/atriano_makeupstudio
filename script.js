/* ================================================================
   ATRIANO MAKE UP STUDIO — script.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════
     1. NAVBAR — scroll effect
  ════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ════════════════════════════════════
     2. MOBILE MENU — open / close
  ════════════════════════════════════ */
  const hamburger    = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeMenu    = document.getElementById('closeMenu');
  const mobileLinks  = document.querySelectorAll('.mobile-link, .mobile-cta');

  const openMenu = () => {
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenuFn = () => {
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuFn);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenuFn));


  /* ════════════════════════════════════
     3. SCROLL REVEAL — Intersection Observer
  ════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════════
     4. NUMBER COUNT-UP ANIMATION (hero badges)
  ════════════════════════════════════ */
  const countEls = document.querySelectorAll('[data-count]');

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.count.includes('.');
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = isDecimal
        ? current.toFixed(1)
        : Math.floor(current);

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    };

    requestAnimationFrame(step);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));


  /* ════════════════════════════════════
     5. TESTIMONI SLIDER — auto + dots + drag
  ════════════════════════════════════ */
  const track    = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');

  if (!track || !dotsWrap) return;

  const cards      = Array.from(track.children);
  let perView      = getPerView();
  let current      = 0;
  let autoTimer    = null;
  let isDragging   = false;
  let dragStartX   = 0;
  let dragDeltaX   = 0;

  function getPerView() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  const maxIndex = () => Math.max(0, cards.length - perView);

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'testi-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.testi-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function next() { goTo(current < maxIndex() ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : maxIndex()); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // Touch / mouse drag
  const onDragStart = (x) => {
    isDragging = true;
    dragStartX = x;
    dragDeltaX = 0;
    stopAuto();
    track.style.transition = 'none';
  };
  const onDragMove = (x) => {
    if (!isDragging) return;
    dragDeltaX = x - dragStartX;
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(${-current * cardWidth + dragDeltaX}px)`;
  };
  const onDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    if (dragDeltaX < -50) next();
    else if (dragDeltaX > 50) prev();
    else goTo(current);
    startAuto();
  };

  // Mouse events
  track.addEventListener('mousedown',  e => onDragStart(e.clientX));
  track.addEventListener('mousemove',  e => onDragMove(e.clientX));
  track.addEventListener('mouseup',    onDragEnd);
  track.addEventListener('mouseleave', onDragEnd);

  // Touch events
  track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove',  e => onDragMove(e.touches[0].clientX),  { passive: true });
  track.addEventListener('touchend',   onDragEnd);

  // Pause on hover
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Responsive resize
  window.addEventListener('resize', () => {
    const newPerView = getPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      current = 0;
      buildDots();
      goTo(0);
    }
  });

  // Init
  buildDots();
  goTo(0);
  startAuto();


  /* ════════════════════════════════════
     6. SMOOTH ACTIVE NAV LINK on scroll
  ════════════════════════════════════ */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));


  /* ════════════════════════════════════
     7. HERO ORBS — subtle parallax
  ════════════════════════════════════ */
  const orbs = document.querySelectorAll('.hero-orb');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });


  /* ════════════════════════════════════
     8. ACTIVE NAV STYLE via CSS
  ════════════════════════════════════ */
  // Injecting active style dynamically
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--gold); }
    .nav-links a.active::after { width: 100%; }`;
  document.head.appendChild(style);

});