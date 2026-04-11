/* Map category emojis/IDs to Lucide Icon names */
const iconMapping = {
  'all': 'layout-grid',
  'rust': 'wrench',
  'apex': 'crosshair',
  'r6': 'shield',
  'cod': 'target',
  'fortnite': 'pickaxe',
  'minecraft': 'box',
  'valorant': 'zap',
  'csgo': 'bomb',
  'utility': 'settings',
  '⚡': 'zap', '🔧': 'wrench', '🎮': 'gamepad-2', '🛡️': 'shield', '🎯': 'target'
};

let allScripts = [];

document.addEventListener('DOMContentLoaded', () => {
  initWelcome();
  loadData();
  setupScrollReveal();
});

async function loadData() {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();
    
    allScripts = data.scripts;
    renderPartners(data.partners);
    renderBanners(data.adBanners);
    renderCategories(data.categories);
    renderScripts(allScripts);
    
    lucide.createIcons();
  } catch (err) {
    console.error("Data Load Error", err);
  }
}

function renderPartners(partners) {
  const container = document.getElementById('partners-grid');
  container.innerHTML = partners.map(p => `
    <a href="${p.url}" target="_blank" class="partner-card reveal">
      <img src="${p.logo}" alt="${p.name}" class="partner-logo">
      <h3>${p.name}</h3>
      <p style="color:var(--accent); font-weight:700; font-size:0.8rem; margin-bottom:10px;">${p.tagline}</p>
      <p style="color:var(--muted); font-size:0.9rem;">${p.description}</p>
    </a>
  `).join('');
}

function renderBanners(banners) {
  const slotMap = { 'hero-bottom': 'slot-hero', 'mid-content': 'slot-mid', 'pre-footer': 'slot-footer' };
  banners.forEach(b => {
    const slot = document.getElementById(slotMap[b.position]);
    if (!slot) return;
    slot.innerHTML = `
      <a href="/ad-form" class="ad-banner">
        <div>
          <small style="text-transform:uppercase; font-size:0.6rem; color:var(--muted);">${b.label}</small>
          <div style="font-weight:800; font-size:1.1rem; margin:4px 0;">${b.cta}</div>
          <div style="color:var(--muted); font-size:0.85rem;">${b.subtext}</div>
        </div>
        <i data-lucide="arrow-right-circle" style="color:var(--accent);"></i>
      </a>
    `;
  });
}

function renderCategories(cats) {
  const container = document.getElementById('cat-tabs');
  container.innerHTML = cats.map(c => `
    <button class="cat-tab ${c.id === 'all' ? 'active' : ''}" onclick="filterScripts('${c.id}')">
      <i data-lucide="${iconMapping[c.id] || 'box'}"></i>
      <span>${c.name}</span>
    </button>
  `).join('');
}

function renderScripts(scripts) {
  const grid = document.getElementById('scripts-grid');
  document.getElementById('result-count').innerText = `${scripts.length} Scripts Found`;
  
  grid.innerHTML = scripts.map(s => `
    <div class="script-card reveal" onclick="openModal('${s.name}')">
      <div style="font-size:0.7rem; font-weight:800; color:var(--accent); text-transform:uppercase; margin-bottom:10px;">${s.game}</div>
      <h3 style="margin-bottom:10px;">${s.name}</h3>
      <p style="color:var(--muted); font-size:0.85rem; margin-bottom:20px;">${s.description}</p>
      <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.8rem; color:var(--muted);"><i data-lucide="download" style="width:14px; vertical-align:middle;"></i> ${s.downloads}</span>
        <button class="btn btn-ghost" style="padding:6px 12px; font-size:0.75rem;">Download</button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

/* Modal and Animation helpers */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initWelcome() {
  const overlay = document.getElementById('welcome-overlay');
  if (localStorage.getItem('hideZenWelcome')) return;
  overlay.classList.remove('hidden');
  document.getElementById('welcome-enter').onclick = () => {
    if (document.getElementById('dont-show-again').checked) localStorage.setItem('hideZenWelcome', true);
    overlay.classList.add('hidden');
  };
}

window.onscroll = () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
};
