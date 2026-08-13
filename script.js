'use strict';
/* ==========================================================================
   Julian Ortiz Gaviria — Portfolio
   Vanilla JS. No frameworks, no build step. Organized as small independent
   init functions bootstrapped from one DOMContentLoaded listener at the
   bottom of the file.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const debounce = (fn, wait = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
const lerp = (a, b, t) => a + (b - a) * t;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const escapeHtml = (str) => { const d = document.createElement('div'); d.textContent = str == null ? '' : String(str); return d.innerHTML; };

/* ---------------------------------------------------------------------- */
/* Data — edit these arrays to update the site's content                   */
/* ---------------------------------------------------------------------- */
const SKILLS = [
  { category: 'Frontend', icon: 'icon-code', items: ['HTML', 'CSS', 'JavaScript', 'Diseño Responsive', 'UI/UX'] },
  { category: 'Backend & APIs', icon: 'icon-server', items: ['Node.js', 'Express', 'PHP', 'APIs REST'] },
  { category: 'Datos', icon: 'icon-database', items: ['MySQL', 'SQL', 'Modelado de datos'] },
  { category: 'Cloud & herramientas', icon: 'icon-cloud', items: ['Git', 'GitHub', 'Vercel', 'Railway', 'Supabase', 'Firebase', 'Electron', 'Cloud Computing'] },
  { category: 'Fundamentos', icon: 'icon-users', items: ['Python', 'IA aplicada al desarrollo', 'Resolución de problemas', 'Trabajo en equipo', 'Aprendizaje autónomo'] },
];

const EXPERIENCE = [
  {
    role: 'Desarrollador de Software Freelance',
    company: 'Invent X Solutions',
    date: '2024 — Presente',
    current: true,
    bullets: [
      'Diseño e implementación de sistemas de inventario, ventas, facturación y punto de venta (POS) para empresas reales.',
      'Proyectos que gestionan más de 8.000 unidades de inventario y reducen significativamente los tiempos operativos.',
      'Despliegue y mantenimiento con Git/GitHub, Vercel, Railway y Supabase.',
      'Reconocimiento universitario al mejor proyecto de software — ediciones 2024 y 2025.',
    ],
  },
  {
    role: 'Gestión Logística',
    company: 'Lola Jeans',
    date: 'Dic 2021 — Ago 2026',
    current: false,
    bullets: [
      'Coordinación de pedidos y despachos, trazabilidad de envíos y rutas de distribución.',
      'Gestión integral de bodega: inventarios, recepción y despacho de mercancía.',
      'Monitoreo continuo de rutas de entrega y atención al cliente en punto físico.',
    ],
  },
  {
    role: 'Soporte Técnico',
    company: 'Línea Comunicaciones',
    date: 'Abr 2021 — Nov 2021',
    current: false,
    bullets: [
      'Instalación y configuración de equipos de telecomunicaciones para operadores como Tigo y WOM.',
      'Apoyo en proyectos de modernización de redes móviles y mejora de cobertura y calidad de señal.',
    ],
  },
  {
    role: 'Soporte Técnico',
    company: 'Universidad EAFIT',
    date: 'Dic 2016 — May 2019',
    current: false,
    bullets: [
      'Soporte técnico de primer y segundo nivel a estudiantes, docentes y personal administrativo.',
      'Mantenimiento preventivo y correctivo de equipos, y soporte técnico en eventos institucionales.',
    ],
  },
];

const STATS = [
  { id: 'projects', value: 8, suffix: '+', label: 'Proyectos entregados' },
  { id: 'tech', value: 15, suffix: '+', label: 'Tecnologías utilizadas' },
  { id: 'units', value: 8000, suffix: '+', label: 'Unidades gestionadas', locale: true },
  { id: 'systems', value: 5, suffix: '+', label: 'Sistemas en producción' },
  { id: 'gh-repos', value: 10, suffix: '+', label: 'Repositorios en GitHub', dynamic: true },
];

// github/demo left as null where no public repo or live demo exists yet —
// the card shows an honest "proyecto privado" badge instead of a dead link.
// Fill these in with real URLs any time and the button appears automatically.
const PROJECTS = [
  {
    slug: 'sistema-inventario-lolajeans', icon: 'icon-database',
    title: 'Sistema de Inventario — Lola Jeans', period: '2024 — 2026', sector: 'Textil',
    tech: ['JavaScript', 'Electron', 'MySQL'],
    desc: 'Aplicación de escritorio para la gestión integral de inventario de una empresa del sector textil: productos, categorías y movimientos de mercancía en un solo lugar.',
    problem: 'El conteo manual de inventario generaba errores frecuentes y trazabilidad casi nula sobre los movimientos de stock.',
    result: 'Control de stock en tiempo real con lectura de códigos de barras, base de datos relacional optimizada y trazabilidad completa de cada movimiento.',
    github: null, demo: null,
  },
  {
    slug: 'invent-x-solutions', icon: 'icon-briefcase',
    title: 'Invent X Solutions — Estudio Freelance', period: '2024 — Presente', sector: 'Multi-sector',
    tech: ['JavaScript', 'React', 'Node.js', 'Express', 'Electron', 'PHP', 'MySQL'],
    desc: 'Mi estudio freelance de desarrollo de software, a través del cual diseño soluciones a la medida para pequeñas y medianas empresas de los sectores textil, comercial y gastronómico.',
    problem: 'Negocios que operan con procesos manuales — inventario en papel o Excel — y ninguna herramienta hecha a su medida.',
    result: 'Más de 8.000 unidades de inventario gestionadas por los sistemas entregados y reconocimiento universitario al mejor proyecto de software en 2024 y 2025.',
    github: 'https://github.com/julianortiz98', demo: null,
  },
  {
    slug: 'gestion-inventario-comercial', icon: 'icon-server',
    title: 'Gestión de Inventario — Sector Comercial', period: '2025 — 2026', sector: 'Comercial',
    tech: ['JavaScript', 'MySQL', 'Roles y auth'],
    desc: 'Aplicación web conectada a una base de datos MySQL para el control integral de mercancía, generación de reportes y administración de usuarios.',
    problem: 'Sin alertas de stock mínimo, el negocio enfrentaba quiebres de inventario y decisiones basadas en información desactualizada.',
    result: 'Reportes automáticos en PDF y Excel, alertas de stock mínimo y escaneo de códigos de barras para agilizar el registro de productos.',
    github: null, demo: null,
  },
  {
    slug: 'emanux-granizados-pos', icon: 'icon-cloud',
    title: 'Emanux Granizados — Ventas & Caja', period: '2026', sector: 'Gastronómico',
    tech: ['JavaScript', 'HTML', 'CSS', 'Railway', 'Vercel'],
    desc: 'Aplicación web responsive para administrar ventas, apertura y cierre de caja e inventario de un establecimiento de bebidas y granizados.',
    problem: 'El control de caja y el descuento de insumos se llevaban de forma manual, sin visibilidad en tiempo real durante la operación diaria.',
    result: 'Descuento automático de insumos por venta, control de efectivo y transferencias, e interfaz optimizada para usarse desde el punto de venta.',
    github: null, demo: null,
  },
  {
    slug: 'pos-taberna-bar', icon: 'icon-terminal',
    title: 'Sistema POS — Taberna & Bar', period: '2026', sector: 'Gastronómico',
    tech: ['React', 'Node.js', 'Express', 'MySQL'],
    desc: 'Sistema de punto de venta para un bar: productos, categorías, mesas, meseros, rondas de consumo y pagos en un flujo pensado para la velocidad del servicio.',
    problem: 'La toma de pedidos y el cierre de cuentas por mesa era lenta y propensa a errores en horas de alta demanda.',
    result: 'API REST propia con Node.js y Express, flujo de atención más rápido y control operativo diario de apertura y cierre de caja.',
    github: null, demo: null,
  },
  {
    slug: 'gestion-retail-tecnologia', icon: 'icon-barcode',
    title: 'Plataforma de Gestión — Retail Tecnológico', period: '2024', sector: 'Comercial',
    tech: ['PHP', 'JavaScript', 'MySQL'],
    desc: 'Plataforma para el registro, control y seguimiento de inventario en una tienda de dispositivos móviles y accesorios.',
    problem: 'El personal necesitaba una forma más rápida de consultar existencias y generar reportes de venta para la toma de decisiones.',
    result: 'Autenticación de usuarios, reportes de ventas y una interfaz orientada a la eficiencia del trabajo diario en tienda.',
    github: null, demo: null,
  },
  {
    slug: 'control-gastos-personal', icon: 'icon-award',
    title: 'Aplicación de Control de Gastos', period: 'Proyecto personal', sector: 'Finanzas personales',
    tech: ['JavaScript', 'HTML', 'CSS'],
    desc: 'Proyecto personal para registrar y visualizar ingresos y gastos por categoría — un espacio para practicar manejo de estado, persistencia de datos y visualización de información.',
    problem: 'Quería una herramienta simple y propia para llevar mis finanzas, sin depender de una app de terceros.',
    result: 'Una aplicación funcional que uso para mi control financiero personal y como espacio constante de práctica de frontend.',
    github: null, demo: null,
    // TODO Julian: personaliza esta descripción con los detalles reales del proyecto.
  },
  {
    slug: 'coleccion-fragancias', icon: 'icon-star',
    title: 'Colección Personal de Fragancias', period: 'Proyecto personal', sector: 'Proyecto personal',
    tech: ['JavaScript', 'HTML', 'CSS'],
    desc: 'Catálogo web personal para organizar y calificar mi colección de fragancias — notas olfativas, fecha de compra y valoración — construido como espacio de práctica de diseño de interfaces.',
    problem: 'Quería un lugar propio, con mi estilo, para catalogar la colección en lugar de una hoja de cálculo suelta.',
    result: 'Una pequeña aplicación con diseño propio que uso activamente y que se ha convertido en mi proyecto favorito para experimentar con UI.',
    github: null, demo: null,
    // TODO Julian: personaliza esta descripción con los detalles reales del proyecto.
  },
];

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c',
  PHP: '#4F5D95', Python: '#3572A5', Java: '#b07219', 'C++': '#f34b7d', C: '#555555',
  Vue: '#41b883', Shell: '#89e051', Dockerfile: '#384d54', EJS: '#a91e50', default: '#8b93a7',
};
const GH_USERNAME = 'julianortiz98';

/* ---------------------------------------------------------------------- */
/* Render — turn data arrays into DOM                                      */
/* ---------------------------------------------------------------------- */
function renderSkills() {
  const grid = $('#skillsGrid');
  if (!grid) return;
  grid.innerHTML = SKILLS.map((cat, i) => `
    <div class="skill-category reveal" style="transition-delay:${i * 60}ms">
      <div class="skill-category-header">
        <span class="skill-category-icon"><svg class="icon" width="20" height="20"><use href="#${cat.icon}"></use></svg></span>
        <span class="skill-category-title">${escapeHtml(cat.category)}</span>
      </div>
      <div class="skill-pills">${cat.items.map(it => `<span class="skill-pill">${escapeHtml(it)}</span>`).join('')}</div>
    </div>`).join('');
}

function renderTimeline() {
  const el = $('#timeline');
  if (!el) return;
  el.innerHTML = EXPERIENCE.map((item, i) => `
    <div class="timeline-item reveal${item.current ? ' is-current' : ''}" style="transition-delay:${i * 80}ms">
      <span class="timeline-node"><span class="timeline-node-dot"></span></span>
      <div class="timeline-head">
        <span class="timeline-role">${escapeHtml(item.role)}</span>
        ${item.current ? '<span class="timeline-tag">ACTUAL</span>' : ''}
      </div>
      <p class="timeline-company">${escapeHtml(item.company)}</p>
      <span class="timeline-date mono">${escapeHtml(item.date)}</span>
      <ul class="timeline-bullets">${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
    </div>`).join('');
}

function renderStats() {
  const grid = $('#statsGrid');
  if (!grid) return;
  grid.innerHTML = STATS.map((s, i) => `
    <div class="stat-card reveal" style="transition-delay:${i * 60}ms">
      <span class="stat-value" id="stat-${s.id}" data-target="${s.value}" data-suffix="${s.suffix}" data-locale="${s.locale ? '1' : '0'}">0</span>
      <span class="stat-label">${escapeHtml(s.label)}</span>
    </div>`).join('');
}

function renderProjects() {
  const grid = $('#projectsGrid');
  if (!grid) return;
  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="project-card reveal" style="transition-delay:${(i % 3) * 70}ms">
      <div class="project-visual">
        <span class="project-visual-icon-wrap"><svg class="icon" width="28" height="28"><use href="#${p.icon}"></use></svg></span>
      </div>
      <div class="project-body">
        <p class="project-slug mono">${escapeHtml(p.slug)}/</p>
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <div class="project-tags">
          <span class="tag">${escapeHtml(p.sector)}</span>
          <span class="tag">${escapeHtml(p.period)}</span>
          ${p.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
        <p class="project-desc">${escapeHtml(p.desc)}</p>
        <div class="project-meta">
          <div class="project-meta-row"><span class="project-meta-label mono">Problema</span><span class="project-meta-value">${escapeHtml(p.problem)}</span></div>
          <div class="project-meta-row"><span class="project-meta-label mono">Resultado</span><span class="project-meta-value">${escapeHtml(p.result)}</span></div>
        </div>
        <div class="project-actions">
          ${p.github
            ? `<a class="btn btn-small btn-ghost" href="${p.github}" target="_blank" rel="noopener noreferrer"><svg class="icon" width="14" height="14"><use href="#icon-github"></use></svg>Código</a>`
            : `<span class="badge-locked"><svg class="icon" width="13" height="13"><use href="#icon-lock"></use></svg>Proyecto privado</span>`}
          ${p.demo ? `<a class="btn btn-small btn-primary" href="${p.demo}" target="_blank" rel="noopener noreferrer"><svg class="icon" width="14" height="14"><use href="#icon-external"></use></svg>Demo</a>` : ''}
        </div>
      </div>
    </article>`).join('');
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal + stat counters                                          */
/* ---------------------------------------------------------------------- */
function observeReveals() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('in-view')); return; }
  window.__revealObserver = window.__revealObserver || new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); window.__revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal:not(.reveal-observed)').forEach(el => { el.classList.add('reveal-observed'); window.__revealObserver.observe(el); });
}

function animateCount(el) {
  const target = parseFloat(el.dataset.target) || 0;
  const suffix = el.dataset.suffix || '';
  const useLocale = el.dataset.locale === '1';
  const format = (n) => (useLocale ? Math.round(n).toLocaleString('es-CO') : Math.round(n)) + suffix;
  if (prefersReducedMotion()) { el.textContent = format(target); return; }
  const duration = 1300;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = format(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

function initStatsCounter() {
  const grid = $('#statsGrid');
  if (!grid || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.stat-value', entry.target).forEach(el => { el.dataset.counted = '1'; animateCount(el); });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  io.observe(grid);
}

function bumpGhRepoStat(count) {
  const el = document.getElementById('stat-gh-repos');
  if (!el || count == null) return;
  el.dataset.target = count;
  if (el.dataset.counted === '1') animateCount(el);
}

/* ---------------------------------------------------------------------- */
/* Tilt effect on project cards                                           */
/* ---------------------------------------------------------------------- */
function initTilt() {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${(x * 6).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------------------------------------------------------------------- */
/* Custom cursor                                                          */
/* ---------------------------------------------------------------------- */
function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function loop() {
    rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  const isInteractive = (el) => el.closest('a, button, input, textarea, .skill-pill, .project-card, .cert-card');
  document.addEventListener('mouseover', (e) => { if (isInteractive(e.target)) ring.classList.add('is-hovering'); });
  document.addEventListener('mouseout', (e) => { if (isInteractive(e.target)) ring.classList.remove('is-hovering'); });
}

/* ---------------------------------------------------------------------- */
/* Particle network background (hero)                                     */
/* ---------------------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('particles');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  const reduced = prefersReducedMotion();
  let w, h, particles = [];
  const mouse = { x: null, y: null, radius: 120 };

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
    const count = reduced ? 0 : Math.min(64, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < mouse.radius) {
          const f = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * f * 0.6; p.y += (dy / dist) * f * 0.6;
        }
      }
    });
    ctx.fillStyle = 'rgba(53, 214, 255, 0.55)';
    particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 118) {
          ctx.strokeStyle = `rgba(53, 214, 255, ${(0.14 * (1 - dist / 118)).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    if (!reduced) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', debounce(resize, 200));
  hero.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  if (!reduced) requestAnimationFrame(step);
}

/* ---------------------------------------------------------------------- */
/* Hero typing effect                                                     */
/* ---------------------------------------------------------------------- */
const ROLE_PHRASES = [
  'Desarrollador Full Stack Junior',
  'Ingeniero de Software en formación — 9° semestre',
  'Construyo sistemas que ya operan en negocios reales',
];
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  if (prefersReducedMotion()) { el.textContent = ROLE_PHRASES[0]; return; }
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const phrase = ROLE_PHRASES[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) { deleting = true; setTimeout(tick, 1900); return; }
      setTimeout(tick, 38 + Math.random() * 42);
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % ROLE_PHRASES.length; setTimeout(tick, 380); return; }
      setTimeout(tick, 20);
    }
  }
  tick();
}

/* ---------------------------------------------------------------------- */
/* Header scroll state + scrollspy                                        */
/* ---------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initScrollspy() {
  const links = $$('.nav-link[data-section]');
  const sections = links.map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const link = $(`.nav-link[data-section="${entry.target.id}"]`);
      if (!link) return;
      links.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => io.observe(s));
}

/* ---------------------------------------------------------------------- */
/* Mobile menu                                                            */
/* ---------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;
  const close = () => { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); document.body.style.overflow = ''; };
  const open = () => { btn.setAttribute('aria-expanded', 'true'); nav.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  btn.addEventListener('click', () => (btn.getAttribute('aria-expanded') === 'true' ? close() : open()));
  $$('a', nav).forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------------------------------------------------------------------- */
/* Theme toggle — in-memory only (see note below for real deployments)     */
/* ---------------------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const goingLight = html.getAttribute('data-theme') !== 'light';
    html.setAttribute('data-theme', goingLight ? 'light' : 'dark');
    btn.setAttribute('aria-pressed', String(goingLight));
    btn.setAttribute('aria-label', goingLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
    /* NOTA — Este portafolio evita localStorage/sessionStorage a propósito
       (la vista previa de artefactos de Claude no los soporta). Una vez
       despliegues el sitio en Vercel o GitHub Pages, puedes recordar la
       preferencia del visitante agregando:
         localStorage.setItem('theme', goingLight ? 'light' : 'dark');
       y al cargar la página:
         const saved = localStorage.getItem('theme');
         if (saved) document.documentElement.setAttribute('data-theme', saved); */
  });
}

/* ---------------------------------------------------------------------- */
/* Sound toggle — subtle synthesized UI tones, off by default              */
/* ---------------------------------------------------------------------- */
let audioCtx = null;
function playTone(freq = 700, duration = 0.045, type = 'sine', gainValue = 0.045) {
  const btn = document.getElementById('soundToggle');
  if (!btn || !btn.classList.contains('sound-on')) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    osc.connect(gain).connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now); osc.stop(now + duration + 0.02);
  } catch (err) { /* Web Audio unavailable — fail silently */ }
}
function initSoundToggle() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const on = btn.classList.toggle('sound-on');
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Desactivar sonido de interfaz' : 'Activar sonido de interfaz');
    if (on) playTone(880, 0.06, 'sine', 0.06);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn, .icon-btn')) playTone(600, 0.04, 'sine', 0.03);
  });
}

/* ---------------------------------------------------------------------- */
/* GitHub — live data from the public REST API                            */
/* ---------------------------------------------------------------------- */
function initGithub() {
  fetchGithubProfile();
  fetchGithubActivity();
  const img = document.getElementById('ghContribImg');
  const fallback = document.getElementById('ghContribFallback');
  if (img) {
    img.addEventListener('error', () => { img.style.display = 'none'; if (fallback) fallback.hidden = false; }, { once: true });
    img.src = `https://ghchart.rshah.org/35d6ff/${GH_USERNAME}`;
  }
}

async function fetchGithubProfile() {
  const bioEl = document.getElementById('ghBio');
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USERNAME}`),
      fetch(`https://api.github.com/users/${GH_USERNAME}/repos?sort=updated&per_page=100`),
    ]);
    if (!userRes.ok) throw new Error('user fetch failed');
    const user = await userRes.json();
    const avatar = document.getElementById('ghAvatar');
    if (avatar) { avatar.src = user.avatar_url || ''; avatar.alt = `Avatar de GitHub de ${user.login}`; }
    document.getElementById('ghUsername').textContent = '@' + user.login;
    bioEl.textContent = user.bio || 'Construyendo software, un commit a la vez.';
    document.getElementById('ghRepoCount').textContent = `${user.public_repos ?? '—'} repos públicos`;
    document.getElementById('ghFollowerCount').textContent = `${user.followers ?? '—'} seguidores`;
    bumpGhRepoStat(user.public_repos);

    if (!reposRes.ok) throw new Error('repos fetch failed');
    const repos = await reposRes.json();
    const original = Array.isArray(repos) ? repos.filter(r => !r.fork) : [];
    renderLanguages(original);
    renderRepos(original);
  } catch (err) {
    bioEl.textContent = 'No se pudieron cargar los datos en este momento (límite de la API pública de GitHub). Puedes ver el perfil directo en el enlace de abajo.';
    document.getElementById('ghRepoCount').textContent = '—';
    document.getElementById('ghFollowerCount').textContent = '—';
    document.getElementById('ghLangs').innerHTML = '<p class="gh-empty">No disponible por ahora.</p>';
    document.getElementById('ghRepos').innerHTML = '<p class="gh-empty">No disponible por ahora.</p>';
  }
}

function renderLanguages(repos) {
  const el = document.getElementById('ghLangs');
  const tally = {};
  repos.forEach(r => { if (r.language) tally[r.language] = (tally[r.language] || 0) + 1; });
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (!entries.length) { el.innerHTML = '<p class="gh-empty">Aún no hay suficientes datos de lenguajes públicos.</p>'; return; }
  const total = entries.reduce((s, [, c]) => s + c, 0);
  const bar = entries.map(([lang, count]) => {
    const pct = (count / total * 100).toFixed(1);
    return `<span style="width:${pct}%; background:${LANG_COLORS[lang] || LANG_COLORS.default}"></span>`;
  }).join('');
  const rows = entries.map(([lang, count]) => {
    const pct = Math.round(count / total * 100);
    return `<div class="gh-lang-row"><span class="gh-lang-name"><span class="gh-lang-dot" style="background:${LANG_COLORS[lang] || LANG_COLORS.default}"></span>${escapeHtml(lang)}</span><span>${pct}%</span></div>`;
  }).join('');
  el.innerHTML = `<div class="gh-lang-bar">${bar}</div>${rows}`;
}

function renderRepos(repos) {
  const el = document.getElementById('ghRepos');
  const top = [...repos].sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at))).slice(0, 6);
  if (!top.length) { el.innerHTML = '<p class="gh-empty">Aún no hay repositorios públicos — pronto habrá más por aquí.</p>'; return; }
  el.innerHTML = top.map(r => {
    const color = LANG_COLORS[r.language] || LANG_COLORS.default;
    return `<a class="gh-repo-item" href="${r.html_url}" target="_blank" rel="noopener noreferrer">
      <p class="gh-repo-name"><svg class="icon" width="14" height="14"><use href="#icon-github"></use></svg>${escapeHtml(r.name)}</p>
      <p class="gh-repo-desc">${r.description ? escapeHtml(r.description) : 'Sin descripción'}</p>
      <div class="gh-repo-foot">
        ${r.language ? `<span class="gh-repo-lang"><span class="gh-repo-lang-dot" style="background:${color}"></span>${escapeHtml(r.language)}</span>` : ''}
        <span><svg class="icon" width="12" height="12"><use href="#icon-star"></use></svg> ${r.stargazers_count}</span>
      </div></a>`;
  }).join('');
}

async function fetchGithubActivity() {
  const el = document.getElementById('ghActivity');
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USERNAME}/events/public?per_page=10`);
    if (!res.ok) throw new Error('activity fetch failed');
    const events = await res.json();
    const lines = Array.isArray(events) ? events.slice(0, 6).map(describeEvent).filter(Boolean).slice(0, 5) : [];
    if (!lines.length) { el.innerHTML = '<p class="gh-empty">Sin actividad pública reciente.</p>'; return; }
    el.innerHTML = lines.map(l => `<div class="gh-activity-item"><time class="mono">${l.date}</time><span>${l.text}</span></div>`).join('');
  } catch (err) {
    el.innerHTML = '<p class="gh-empty">No se pudo cargar la actividad reciente.</p>';
  }
}

function describeEvent(ev) {
  const repo = ev.repo ? escapeHtml(ev.repo.name.split('/').pop()) : 'repositorio';
  const date = new Date(ev.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  const map = {
    PushEvent: `Hizo push a <strong>${repo}</strong>`,
    CreateEvent: (ev.payload && ev.payload.ref_type === 'repository') ? `Creó el repositorio <strong>${repo}</strong>` : `Creó una rama en <strong>${repo}</strong>`,
    WatchEvent: `Destacó (★) <strong>${repo}</strong>`,
    ForkEvent: `Bifurcó <strong>${repo}</strong>`,
    IssuesEvent: `Actualizó un issue en <strong>${repo}</strong>`,
    PullRequestEvent: `Actualizó un pull request en <strong>${repo}</strong>`,
    IssueCommentEvent: `Comentó en <strong>${repo}</strong>`,
  };
  const text = map[ev.type];
  return text ? { text, date } : null;
}

/* ---------------------------------------------------------------------- */
/* Contact form — validation + EmailJS-ready structure                    */
/* ---------------------------------------------------------------------- */
const EMAILJS_CONFIG = { PUBLIC_KEY: '', SERVICE_ID: '', TEMPLATE_ID: '' };
/*  Para activar el envío real de mensajes:
    1. Crea una cuenta gratuita en https://www.emailjs.com/
    2. Crea un Service y un Template (usa las variables {{name}}, {{email}}, {{message}})
    3. Descomenta la etiqueta <script> de EmailJS en index.html (justo antes de script.js)
    4. Completa PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID arriba
    Hasta entonces, el formulario valida los campos y le indica al visitante
    que te escriba directo por correo — nunca falla en silencio.          */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');

  const fields = {
    name: { input: document.getElementById('cf-name'), error: document.getElementById('err-name'), validate: v => (v.trim().length >= 2 ? '' : 'Escribe tu nombre completo.') },
    email: { input: document.getElementById('cf-email'), error: document.getElementById('err-email'), validate: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Escribe un email válido.') },
    message: { input: document.getElementById('cf-message'), error: document.getElementById('err-message'), validate: v => (v.trim().length >= 10 ? '' : 'Cuéntame un poco más (mínimo 10 caracteres).') },
  };

  function validateField(key) {
    const f = fields[key];
    const msg = f.validate(f.input.value);
    f.error.textContent = msg;
    f.input.closest('.form-row').classList.toggle('is-invalid', Boolean(msg));
    return !msg;
  }
  Object.keys(fields).forEach(key => fields[key].input.addEventListener('blur', () => validateField(key)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) { status.textContent = 'Revisa los campos marcados en rojo.'; status.className = 'form-status mono is-error'; return; }

    const payload = { name: fields.name.input.value.trim(), email: fields.email.input.value.trim(), message: fields.message.input.value.trim() };
    const configured = EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID && window.emailjs;

    submitBtn.disabled = true;
    status.className = 'form-status mono';
    status.textContent = 'Enviando…';

    if (configured) {
      try {
        await window.emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, payload, EMAILJS_CONFIG.PUBLIC_KEY);
        status.textContent = '¡Mensaje enviado! Te responderé pronto.';
        status.className = 'form-status mono is-success';
        form.reset();
      } catch (err) {
        status.textContent = 'No se pudo enviar. Escríbeme directo a julianortizg98@gmail.com.';
        status.className = 'form-status mono is-error';
      }
    } else {
      status.textContent = 'El envío automático aún no está configurado — escríbeme directo a julianortizg98@gmail.com mientras tanto.';
      status.className = 'form-status mono';
    }
    submitBtn.disabled = false;
  });
}

/* ---------------------------------------------------------------------- */
/* Back to top                                                            */
/* ---------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  document.addEventListener('scroll', debounce(() => btn.classList.toggle('is-visible', window.scrollY > 700), 80), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
}

/* ---------------------------------------------------------------------- */
/* Interactive terminal                                                   */
/* ---------------------------------------------------------------------- */
function initTerminal() {
  const launcher = document.getElementById('terminalLauncher');
  const overlay = document.getElementById('terminalOverlay');
  const panel = document.getElementById('terminalPanel');
  const closeBtn = document.getElementById('terminalClose');
  const outputEl = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  if (!launcher || !panel) return;

  let welcomed = false;
  let history = [];
  let historyIndex = -1;

  function printLine(text, type = 'out') {
    const p = document.createElement('p');
    p.className = `term-line term-line-${type}`;
    p.innerHTML = text;
    outputEl.appendChild(p);
    outputEl.parentElement.scrollTop = outputEl.parentElement.scrollHeight;
  }
  function printCmd(text) {
    const p = document.createElement('p');
    p.className = 'term-line term-line-cmd';
    p.textContent = text;
    outputEl.appendChild(p);
  }

  function open() {
    overlay.hidden = false; panel.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!welcomed) { printLine('Terminal interactiva — escribe <strong>help</strong> para ver los comandos disponibles.', 'accent'); welcomed = true; }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    overlay.hidden = true; panel.hidden = true;
    document.body.style.overflow = '';
    launcher.focus();
  }
  launcher.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });

  const COMMANDS = {
    help: () => [
      'Comandos disponibles:',
      '  about        — quién soy',
      '  skills       — mi stack técnico',
      '  proyectos    — proyectos destacados',
      '  experiencia  — historial laboral',
      '  contacto     — cómo contactarme',
      '  whoami       — identidad',
      '  date         — fecha y hora',
      '  clear        — limpiar la terminal',
      '  exit         — cerrar la terminal',
    ].join('\n'),
    about: () => 'Estudiante de Ingeniería en Desarrollo de Software (9° semestre) y desarrollador full stack junior. Construyo sistemas de inventario, POS y automatización para negocios reales desde 2024.',
    skills: () => SKILLS.map(c => `${c.category}: ${c.items.join(', ')}`).join('\n'),
    proyectos: () => PROJECTS.map(p => `${p.slug}/  — ${p.title}`).join('\n'),
    experiencia: () => EXPERIENCE.map(e => `${e.date}   ${e.role} — ${e.company}`).join('\n'),
    contacto: () => 'email: julianortizg98@gmail.com\ngithub: github.com/julianortiz98\nlinkedin: linkedin.com/in/juliandavidortizgaviria1998\nubicación: Medellín, Colombia',
    whoami: () => 'julian-david-ortiz-gaviria — desarrollador full stack junior',
    date: () => new Date().toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' }),
    coffee: () => 'Nivel de cafeína: óptimo. Continuando compilación... ☕',
    matrix: () => 'Sigue el conejo blanco, Julian... (o sigue haciendo scroll, también funciona) 🐇',
  };
  COMMANDS.projects = COMMANDS.proyectos;
  COMMANDS.experience = COMMANDS.experiencia;
  COMMANDS.contact = COMMANDS.contacto;
  COMMANDS.cafe = COMMANDS.coffee;

  function handle(raw) {
    const cmdRaw = raw.trim();
    if (!cmdRaw) return;
    printCmd(cmdRaw);
    history.push(cmdRaw); historyIndex = history.length;
    const lower = cmdRaw.toLowerCase();

    if (lower === 'clear' || lower === 'cls') { outputEl.innerHTML = ''; return; }
    if (lower === 'exit' || lower === 'salir' || lower === 'close') { close(); return; }
    if (lower.startsWith('sudo')) { printLine('Permiso denegado: incluso Julian revisa el código antes de mergear a main. 😄', 'error'); return; }
    if (COMMANDS[lower]) { printLine(escapeHtml(COMMANDS[lower]()).replace(/\n/g, '<br>'), 'out'); return; }
    printLine(`bash: comando no encontrado: ${escapeHtml(cmdRaw)} — escribe "help" para ver los comandos disponibles.`, 'error');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { handle(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (historyIndex > 0) { historyIndex--; input.value = history[historyIndex] || ''; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyIndex < history.length) { historyIndex++; input.value = history[historyIndex] || ''; } }
  });
}

/* ---------------------------------------------------------------------- */
/* Konami code easter egg                                                 */
/* ---------------------------------------------------------------------- */
function initKonami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  const overlay = document.getElementById('easterEgg');
  const closeBtn = document.getElementById('easterEggClose');
  if (!overlay) return;
  const show = () => { overlay.hidden = false; playTone(1046, 0.08, 'triangle', 0.05); };
  const hide = () => { overlay.hidden = true; };
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos]) { pos++; if (pos === seq.length) { show(); pos = 0; } }
    else { pos = key === seq[0] ? 1 : 0; }
  });
}

/* ---------------------------------------------------------------------- */
/* Preloader                                                              */
/* ---------------------------------------------------------------------- */
function initPreloader() {
  const pre = document.getElementById('preloader');
  const pctEl = document.getElementById('preloaderPercent');
  if (!pre) return;
  document.body.style.overflow = 'hidden';
  let simPct = 0, pageLoaded = false;
  const timer = setInterval(() => {
    simPct = Math.min(simPct + Math.random() * 14 + 5, pageLoaded ? 100 : 92);
    if (pctEl) pctEl.textContent = Math.floor(simPct) + '%';
    if (simPct >= 100) finish();
  }, 130);
  function finish() {
    clearInterval(timer);
    setTimeout(() => { pre.classList.add('is-hidden'); document.body.style.overflow = ''; }, 280);
  }
  window.addEventListener('load', () => { pageLoaded = true; }, { once: true });
  setTimeout(() => { pageLoaded = true; }, 2500);
}

/* ---------------------------------------------------------------------- */
/* Misc                                                                   */
/* ---------------------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------------------- */
/* Bootstrap                                                              */
/* ---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  renderSkills();
  renderTimeline();
  renderStats();
  renderProjects();
  initTilt();
  observeReveals();
  initStatsCounter();
  initCursor();
  initParticles();
  initTyping();
  initHeaderScroll();
  initScrollspy();
  initMobileMenu();
  initThemeToggle();
  initSoundToggle();
  initGithub();
  initContactForm();
  initBackToTop();
  initTerminal();
  initKonami();
  initFooterYear();
});
