// ── Frame-buster (meta CSP frame-ancestors is ignored by browsers) ──
if (window.top !== window.self) { window.top.location = window.location.href; }

// ── Tile layers per theme ───────────────────────────────────
const TILES = {
  luz: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  noite: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  glorioso: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  classico: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  ultras: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  aguia: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// ── Map init ────────────────────────────────────────────────
const map = L.map('map').setView([20, 0], 2);
let tileLayer = null;

function applyTile(theme) {
  if (tileLayer) map.removeLayer(tileLayer);
  const t = TILES[theme] || TILES.luz;
  tileLayer = L.tileLayer(t.url, { attribution: t.attribution, subdomains: 'abcd', maxZoom: 19 });
  tileLayer.addTo(map);
}

// ── Theme switching ─────────────────────────────────────────
function setTheme(name) {
  document.body.dataset.theme = name;
  applyTile(name);
  localStorage.setItem('theme', name);

  document.querySelectorAll('#theme-options button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === name);
  });

  document.getElementById('theme-options').classList.remove('open');
}

function toggleThemePicker() {
  document.getElementById('theme-options').classList.toggle('open');
}

// Close picker when clicking the map
map.on('click', () => document.getElementById('theme-options').classList.remove('open'));

// ── Marker sizing ────────────────────────────────────────────
function markerSize() {
  const z = map.getZoom();
  if (z <= 3)  return 14;
  if (z <= 5)  return 20;
  if (z <= 7)  return 26;
  if (z <= 10) return 32;
  return 40;
}

function makeIcon(thumb, size) {
  return L.divIcon({
    className: 'photo-marker',
    html: `<img src="${thumb}" alt="" loading="lazy">`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2]
  });
}

// ── HTML sanitisation ────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ── Markers ─────────────────────────────────────────────────
const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });
const allMarkers = [];

fetch('data.json')
  .then(r => r.json())
  .then(posts => {
    posts.forEach(post => {
      if (!post.lat || !post.lng) return;

      const shortcode = esc(post.shortcode);
      const instaUrl = `https://www.instagram.com/p/${shortcode}/`;
      const caption = post.caption
        ? `<p class="popup-caption">${esc(post.caption)}</p>`
        : '';

      const thumb = esc(post.thumb);
      const date  = esc(post.date || '');
      const marker = L.marker([post.lat, post.lng], { icon: makeIcon(thumb, markerSize()) });
      marker.bindPopup(`
        <a href="${instaUrl}" target="_blank" rel="noopener noreferrer">
          <img class="popup-img" src="${thumb}" alt="">
        </a>
        <div class="popup-body">
          ${caption}
          <span class="popup-date">${date}</span>
          <a class="popup-link" href="${instaUrl}" target="_blank" rel="noopener noreferrer">ver no instagram ↗</a>
        </div>
      `);

      marker._thumb = thumb;
      allMarkers.push(marker);
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
  })
  .catch(err => console.error('Failed to load data.json:', err));

map.on('zoomend', () => {
  const size = markerSize();
  allMarkers.forEach(m => m.setIcon(makeIcon(m._thumb, size)));
});

// ── FAQ ──────────────────────────────────────────────────────
function openFaq()  { document.getElementById('faq-overlay').classList.add('open'); }
function closeFaq() { document.getElementById('faq-overlay').classList.remove('open'); }

// ── Event listeners (CSP-safe, no inline handlers) ───────────
document.getElementById('theme-toggle').addEventListener('click', toggleThemePicker);

document.querySelectorAll('#theme-options button').forEach(btn => {
  btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

document.getElementById('faq-btn').addEventListener('click', openFaq);
document.getElementById('faq-overlay').addEventListener('click', closeFaq);
document.getElementById('faq').addEventListener('click', e => e.stopPropagation());
document.querySelector('.faq-close').addEventListener('click', closeFaq);

// ── Boot ─────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('theme') || 'aguia';
setTheme(savedTheme);
// mark saved theme active on load
document.querySelectorAll('#theme-options button').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.theme === savedTheme);
});
