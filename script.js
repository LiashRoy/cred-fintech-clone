/* ===== SCRIPT.JS — CRED Fintech Encyclopedia ===== */

// ─── 1. CURSOR GLOW ───────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ─── 2. PARTICLE CANVAS ────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.7 ? '#FFCB45' : '#ffffff',
  };
}

for (let i = 0; i < 80; i++) {
  particles.push(createParticle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── 3. NAVBAR SCROLL EFFECT + ACTIVE LINK ────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Navbar style
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
      
      // Auto-scroll the nav container on mobile to keep active link centered
      const navContainer = document.querySelector('.nav-links');
      if (navContainer && navContainer.scrollWidth > navContainer.clientWidth) {
        const scrollLeft = link.offsetLeft - (navContainer.clientWidth / 2) + (link.clientWidth / 2);
        navContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ─── 4. NUMBER COUNTER ANIMATION ──────────────────
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const startVal = 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = startVal + (target - startVal) * eased;

    if (isDecimal) {
      el.textContent = value.toFixed(1);
    } else {
      el.textContent = Math.floor(value).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = isDecimal ? target.toFixed(1) : Number(target).toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

// ─── 5. INTERSECTION OBSERVER (Animate on Scroll) ─
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Counter elements
    if (el.classList.contains('counter')) {
      const target = parseFloat(el.getAttribute('data-target'));
      animateCounter(el, target);
      observer.unobserve(el);
      return;
    }

    // Counter inline
    if (el.classList.contains('counter-inline')) {
      const target = parseFloat(el.getAttribute('data-target'));
      animateCounter(el, target, 2500);
      observer.unobserve(el);
      return;
    }

    // Generic visibility
    el.classList.add('visible');
    observer.unobserve(el);
  });
}, observerOptions);

// Observe counters
document.querySelectorAll('.counter, .counter-inline').forEach((el) => {
  observer.observe(el);
});

// Observe animated elements
const animatedEls = [
  '.friction-point',
  '.timeline-item',
  '.revenue-card',
  '.scale-stat-card',
  '.status-card',
];
animatedEls.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    // Add staggered delay
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});

// ─── 6. SMOOTH SCROLL FOR NAV LINKS ───────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── 7. CARD TILT EFFECT ──────────────────────────
function addTiltEffect(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
addTiltEffect('.revenue-card');
addTiltEffect('.fin-card');
addTiltEffect('.scale-number-item');
addTiltEffect('.persona-card');

// ─── 8. HERO LOGO GLOW ON HOVER ───────────────────
const heroLogoSvg = document.querySelector('.hero-logo-svg');
if (heroLogoSvg) {
  heroLogoSvg.addEventListener('mouseenter', () => {
    heroLogoSvg.style.filter = 'drop-shadow(0 0 30px rgba(255,203,69,0.7))';
  });
  heroLogoSvg.addEventListener('mouseleave', () => {
    heroLogoSvg.style.filter = 'drop-shadow(0 0 24px rgba(255,255,255,0.15))';
  });
}

// ─── 9. DYNAMIC SECTION REVEAL ────────────────────
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.section-header').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  sectionObserver.observe(el);
});

// ─── 10. MOBILE HAMBURGER (if needed) ─────────────
// Nav links hidden on mobile — could add a hamburger
// For now, the critical sections are accessible via scroll

// ─── 11. PAGE LOAD ANIMATION ──────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ─── 13. MOBILE TOOLTIP TOGGLE ──────────────────────
const appProfile = document.querySelector('.app-profile');
if (appProfile) {
  appProfile.addEventListener('click', (e) => {
    // Only apply toggle logic on mobile/touch screens
    if (window.innerWidth <= 768) {
      appProfile.classList.toggle('active-tooltip');
    }
  });
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !appProfile.contains(e.target)) {
      appProfile.classList.remove('active-tooltip');
    }
  });
}

console.log(
  '%c CRED — Global Fintech Encyclopedia %c Built for PGDM Fintech Course ',
  'background:#FFCB45;color:#000;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
  'background:#121212;color:#FFCB45;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;border:1px solid #FFCB45;'
);

// ─── 14. THEME TOGGLE ─────────────────────────────
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
const toggleBtns = [themeToggleBtn, themeToggleBtnMobile].filter(Boolean);

const sunIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

if (toggleBtns.length > 0) {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    toggleBtns.forEach(btn => btn.innerHTML = moonIcon + ' Dark Mode');
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        toggleBtns.forEach(b => b.innerHTML = sunIcon + ' Light Mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleBtns.forEach(b => b.innerHTML = moonIcon + ' Dark Mode');
      }
    });
  });
}
