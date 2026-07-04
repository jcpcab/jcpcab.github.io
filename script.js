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
  let minBtn;
  let maxBtn;
  if (win.querySelector('.mac-dot')) {
    minBtn = win.querySelector('.mac-2');
    maxBtn = win.querySelector('.mac-3');
  } else if (win.querySelector('.s7-box')) {
    const boxes = win.querySelectorAll('.s7-box');
    minBtn = boxes[0];
    maxBtn = boxes[boxes.length - 1];
  } else {
    const btns = win.querySelectorAll('.tb10, .mint-btn, .tb95, .tbxp');
    minBtn = btns[0];
    maxBtn = btns[1];
  }
  if (!minBtn || !maxBtn) return;

  const setState = (minimized) => {
    win.classList.toggle('minimized', minimized);
    minBtn.setAttribute('aria-expanded', String(!minimized));
  };

  const setup = (btn, label, action) => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', label);
    btn.title = label;
    btn.removeAttribute('aria-hidden');
    btn.parentElement.removeAttribute('aria-hidden');
    btn.addEventListener('click', action);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    });
  };

  minBtn.classList.add('tb-min');
  maxBtn.classList.add('tb-max');
  minBtn.setAttribute('aria-expanded', 'true');
  setup(minBtn, 'Minimize section', () => setState(true));
  setup(maxBtn, 'Restore section', () => setState(false));

  win.querySelector('.titlebar').addEventListener('click', (e) => {
    if (!win.classList.contains('minimized')) return;
    if (e.target.closest('.tb-min, .tb-max')) return;
    setState(false);
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
