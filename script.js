const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.addEventListener('click', (e) => {
  if (e.target.matches('a')) {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.window:not(.boot), .job, .file-row');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  targets.forEach((el) => {
    el.classList.add('reveal-init');
    observer.observe(el);
  });
}

document.querySelectorAll('.window').forEach((win) => {
  const btn = win.querySelector('.mac-2') ||
    win.querySelector('.tb10, .mint-btn, .tb95, .tbxp, .s7-box');
  if (!btn) return;

  const hasGlyph = !btn.classList.contains('mac-2') && !btn.classList.contains('s7-box');
  const originalGlyph = hasGlyph ? btn.textContent : null;

  btn.classList.add('tb-min');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-label', 'Minimize section');
  btn.setAttribute('aria-expanded', 'true');
  btn.title = 'Minimize';
  btn.removeAttribute('aria-hidden');
  btn.parentElement.removeAttribute('aria-hidden');

  const toggle = () => {
    const minimized = win.classList.toggle('minimized');
    btn.setAttribute('aria-expanded', String(!minimized));
    btn.setAttribute('aria-label', minimized ? 'Restore section' : 'Minimize section');
    btn.title = minimized ? 'Restore' : 'Minimize';
    if (hasGlyph) btn.textContent = minimized ? '❐' : originalGlyph;
  };

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  win.querySelector('.titlebar').addEventListener('click', (e) => {
    if (!win.classList.contains('minimized')) return;
    if (e.target.closest('.tb-min')) return;
    toggle();
  });
});

const trayLabel = document.getElementById('view-label');
const trayFill = document.querySelector('.tray-fill');
const allWindows = Array.from(document.querySelectorAll('.window'));
let scrollTick = false;

function updateScrollUI() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (trayFill) trayFill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

  const mid = window.innerHeight / 2;
  let focused = null;
  let bestDist = Infinity;
  allWindows.forEach((w) => {
    const r = w.getBoundingClientRect();
    const dist = Math.abs(r.top + r.height / 2 - mid);
    if (dist < bestDist) {
      bestDist = dist;
      focused = w;
    }
  });
  allWindows.forEach((w) => w.classList.toggle('dimmed', w !== focused));
  if (focused && trayLabel) {
    const t = focused.querySelector('.titlebar-title');
    if (t) trayLabel.textContent = t.textContent.trim();
  }
  scrollTick = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTick) {
    scrollTick = true;
    requestAnimationFrame(updateScrollUI);
  }
}, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

const clock = document.getElementById('clock');
function updateClock() {
  clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 30000);

document.getElementById('year').textContent = new Date().getFullYear();
