class StoryDetailView {
  #container;

  constructor(container) {
    this.#container = container;
  }

  showLoading() {
    this.#container.innerHTML = `
      <section class="story-detail-page" aria-label="Detail Cerita">
        <div class="container">
          <div class="loading-container" role="status" aria-live="polite">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p>Memuat detail cerita...</p>
          </div>
        </div>
      </section>
    `;
  }

  showError(message) {
    this.#container.innerHTML = `
      <section class="story-detail-page" aria-label="Detail Cerita">
        <div class="container">
          <div class="error-state" role="alert">
            <h1>Cerita Tidak Ditemukan</h1>
            <p>${message || 'Cerita yang Anda cari tidak ditemukan atau sudah dihapus.'}</p>
            <a href="#/" class="btn btn-primary">← Kembali ke Home</a>
          </div>
        </div>
      </section>
    `;
  }

  showStory(story) {
    const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const hasLocation = story.lat && story.lon;

    this.#container.innerHTML = `
      <article class="story-detail-page" aria-label="Detail cerita dari ${story.name}">
        <div class="container">
          <a href="#/" class="back-link" aria-label="Kembali ke daftar cerita">
            ← Kembali
          </a>

          <div class="story-detail-card">
            <figure class="story-detail-figure">
              <img
                src="${story.photoUrl}"
                alt="Foto cerita dari ${story.name}"
                class="story-detail-image"
              >
            </figure>

            <div class="story-detail-content">
              <header class="story-detail-header">
                <h1 class="story-detail-author">${story.name}</h1>
                <time class="story-detail-date" datetime="${story.createdAt}">
                  📅 ${date}
                </time>
              </header>

              <div class="story-detail-description">
                <h2 class="visually-hidden">Isi Cerita</h2>
                <p>${story.description}</p>
              </div>

              ${hasLocation ? `
                <div class="story-detail-map-section">
                  <h2 class="story-detail-section-title">📍 Lokasi Cerita</h2>
                  <div id="story-detail-map" class="story-detail-map" role="img" aria-label="Peta lokasi cerita"></div>
                  <p class="story-detail-coords">
                    Koordinat: ${parseFloat(story.lat).toFixed(6)}, ${parseFloat(story.lon).toFixed(6)}
                  </p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </article>
    `;

    if (hasLocation) {
      this.#initMap(story.lat, story.lon, story.name);
    }
  }

  #initMap(lat, lon, name) {
    import('leaflet').then((L) => {
      const map = L.default.map('story-detail-map').setView([lat, lon], 14);
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
      L.default.marker([lat, lon]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
    }).catch(() => {
      const mapEl = document.getElementById('story-detail-map');
      if (mapEl) mapEl.innerHTML = '<p>Gagal memuat peta</p>';
    });
  }
}

export default StoryDetailView;
