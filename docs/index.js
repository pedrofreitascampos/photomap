const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });

fetch('data.json')
  .then(r => r.json())
  .then(posts => {
    posts.forEach(post => {
      if (!post.lat || !post.lng) return;

      const icon = L.divIcon({
        className: 'photo-marker',
        html: `<img src="${post.thumb}" alt="" loading="lazy">`,
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -28]
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
        ${caption}
        <span class="popup-date">${post.date}</span>
        <a class="popup-link" href="${instaUrl}" target="_blank" rel="noopener">ver no instagram</a>
      `);

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
  })
  .catch(err => console.error('Failed to load data.json:', err));

function openFaq() {
  document.getElementById('faq-overlay').classList.add('open');
}

function closeFaq() {
  document.getElementById('faq-overlay').classList.remove('open');
}
