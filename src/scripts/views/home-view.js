import L from 'leaflet';

class HomeView {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.markers = [];
  }

  render() {
    this.container.innerHTML = `
      <section class="home-section container">
        <h1 class="section-title">Explore Stories</h1>
        
        <div class="map-container card">
          <div id="story-map" class="map"></div>
        </div>

        <div class="story-list-container">
          <div id="story-list" class="story-list" role="list" aria-label="Daftar cerita">
            <!-- Story items will be populated here -->
          </div>
        </div>
      </section>
    `;
  }

  renderStories(stories, savedIds = new Set()) {
    const listContainer = this.container.querySelector('#story-list');
    listContainer.innerHTML = '';
    
    if (stories.length === 0) {
      listContainer.innerHTML = '<p class="empty-state">No stories found.</p>';
      return;
    }

    stories.forEach(story => {
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const isSaved = savedIds.has(story.id);
      const article = document.createElement('article');
      article.classList.add('story-card', 'card');
      article.setAttribute('role', 'listitem');
      article.setAttribute('aria-label', `Cerita oleh ${story.name}`);
      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita dari ${story.name}" class="story-image" loading="lazy">
        <div class="story-info">
          <h2 class="story-author">${story.name}</h2>
          <p class="story-date">${date}</p>
          <p class="story-desc">${story.description}</p>
          <button
            class="btn btn-bookmark ${isSaved ? 'btn-bookmark--saved' : ''}"
            data-story-id="${story.id}"
            data-story-json='${JSON.stringify(story).replace(/'/g, '&#39;')}'
            aria-label="${isSaved ? 'Hapus dari tersimpan' : 'Simpan cerita'} oleh ${story.name}"
            aria-pressed="${isSaved}"
          >
            ${isSaved ? '🔖 Tersimpan' : '🔖 Simpan'}
          </button>
        </div>
      `;
      listContainer.appendChild(article);
    });
  }

  bindSaveEvent(handler) {
    const list = this.container.querySelector('#story-list');
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-bookmark');
      if (btn) {
        const storyData = JSON.parse(btn.dataset.storyJson);
        const isSaved = btn.getAttribute('aria-pressed') === 'true';
        handler(storyData, isSaved, btn);
      }
    });
  }

  updateBookmarkButton(btn, isSaved) {
    btn.textContent = isSaved ? '🔖 Tersimpan' : '🔖 Simpan';
    btn.setAttribute('aria-pressed', isSaved);
    btn.setAttribute(
      'aria-label',
      `${isSaved ? 'Hapus dari tersimpan' : 'Simpan cerita'}`
    );
    if (isSaved) {
      btn.classList.add('btn-bookmark--saved');
    } else {
      btn.classList.remove('btn-bookmark--saved');
    }
  }

  initMap(stories) {
    // Basic setup
    this.map = L.map('story-map').setView([-2.5, 118], 5); // Center of Indonesia

    // Base layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri'
    });

    osmLayer.addTo(this.map);

    // Add layer control
    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satelliteLayer
    };
    L.control.layers(baseMaps).addTo(this.map);

    // Add markers
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          ${story.description.substring(0, 80)}...
        `);
        this.markers.push(marker);
      }
    });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export default HomeView;
