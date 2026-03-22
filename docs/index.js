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

// ── Markers ─────────────────────────────────────────────────
const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });

fetch('data.json')
  .then(r => r.json())
  .then(posts => {
    posts.forEach(post => {
      if (!post.lat || !post.lng) return;

      const icon = L.divIcon({
        className: 'photo-marker',
        html: `<img src="${post.thumb}" alt="" loading="lazy">`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const instaUrl = `https://www.instagram.com/p/${post.shortcode}/`;
      const caption = post.caption
        ? `<p class="popup-caption">${post.caption}</p>`
        : '';

      const marker = L.marker([post.lat, post.lng], { icon });
      marker.bindPopup(`
        <a href="${instaUrl}" target="_blank" rel="noopener">
          <img class="popup-img" src="${post.thumb}" alt="">
        </a>
        <div class="popup-body">
          ${caption}
          <span class="popup-date">${post.date}</span>
          <a class="popup-link" href="${instaUrl}" target="_blank" rel="noopener">ver no instagram ↗</a>
        </div>
      `);

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
  })
  .catch(err => console.error('Failed to load data.json:', err));

// ── FAQ ──────────────────────────────────────────────────────
function openFaq()  { document.getElementById('faq-overlay').classList.add('open'); }
function closeFaq() { document.getElementById('faq-overlay').classList.remove('open'); }

// ── Boot ─────────────────────────────────────────────────────
const savedTheme = localStorage.getItem('theme') || 'luz';
setTheme(savedTheme);
// mark saved theme active on load
document.querySelectorAll('#theme-options button').forEach(btn => {
  btn.classList.toggle('active', btn.dataset.theme === savedTheme);
});
