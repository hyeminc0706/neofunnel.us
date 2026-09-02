// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

// Nav is transparent+white only while the hero photo is on screen;
// switches to the normal solid nav right as the next section (ticker) arrives.
const navEl = document.querySelector('.nav');
const heroEl = document.querySelector('.hero');
if (navEl && heroEl && 'IntersectionObserver' in window) {
  const navHeight = navEl.offsetHeight || 76;
  const heroIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      navEl.classList.toggle('on-hero', entry.isIntersecting);
    });
  }, { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 });
  heroIO.observe(heroEl);
} else if (navEl && heroEl) {
  navEl.classList.add('on-hero');
}
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Contact form — submits to Formspree (no backend needed)
const form = document.querySelector('#contact-form');
const formCard = document.querySelector('.form-card');
if (form && formCard) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.form-submit');
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = '전송 중...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const successEl = formCard.querySelector('.form-success');
        form.style.display = 'none';
        successEl.classList.add('show');
      } else {
        submitBtn.textContent = '전송 실패 — 다시 시도해주세요';
        submitBtn.disabled = false;
        setTimeout(() => { submitBtn.textContent = originalLabel; }, 2500);
      }
    } catch (err) {
      submitBtn.textContent = '전송 실패 — 다시 시도해주세요';
      submitBtn.disabled = false;
      setTimeout(() => { submitBtn.textContent = originalLabel; }, 2500);
    }
  });
}

// Animated bar charts in the Data section — fill from 0 to target % on scroll-in
const chartFills = document.querySelectorAll('.chart-fill');
if (chartFills.length && 'IntersectionObserver' in window) {
  const chartIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.getAttribute('data-value') || '0';
        requestAnimationFrame(() => { entry.target.style.width = target + '%'; });
        chartIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  chartFills.forEach(el => chartIO.observe(el));
}

// Tap-to-toggle source tooltip on touch devices — works for any .has-tip wrapper
document.querySelectorAll('.info-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const wrap = dot.closest('.has-tip');
    if (!wrap) return;
    document.querySelectorAll('.has-tip.tip-open').forEach(w => { if (w !== wrap) w.classList.remove('tip-open'); });
    wrap.classList.toggle('tip-open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.has-tip.tip-open').forEach(w => w.classList.remove('tip-open'));
});

// Reveal-on-scroll for section heads and cards (fade + slide up, staggered)
const revealTargets = document.querySelectorAll(
  '.section-head, .pipe-step, .why-item, .step, .proof-card, .stat-box, .data-card, .data-stat, .addon-card, .mini-stat, .service-card'
);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => {
    // stagger based on position among same-type siblings for a cascading slide-in
    const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
    const idx = siblings.indexOf(el);
    const delay = Math.min(idx, 5) * 90;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`;
    io.observe(el);
  });
}

// Count-up animation for big numbers (e.g. "154만+") — triggers once on scroll-in
const counters = document.querySelectorAll('[data-count-to]');
if (counters.length && 'IntersectionObserver' in window) {
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count-to'));
      const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countIO.observe(el));
}
