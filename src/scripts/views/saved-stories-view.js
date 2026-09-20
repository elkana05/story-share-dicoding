class SavedStoriesView {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="saved-stories-section container">
        <div class="saved-header">
          <h1 class="section-title">
            <span class="bookmark-icon">🔖</span> Saved Stories
          </h1>
          <div id="offline-banner" class="offline-banner d-none" role="alert" aria-live="polite">
            ⚠️ Anda sedang offline. Konten mungkin tidak terbaru.
          </div>
          <div id="pending-banner" class="pending-banner d-none" role="status" aria-live="polite">
            <span id="pending-count">0</span> cerita offline menunggu sinkronisasi.
            <button id="btn-sync" class="btn btn-sm btn-primary" aria-label="Sinkronisasi cerita offline sekarang">
              Sync Sekarang
            </button>
          </div>
        </div>

        <div class="saved-controls card">
          <div class="controls-row">
            <div class="search-wrapper">
              <label for="search-input" class="visually-hidden">Cari cerita tersimpan</label>
              <input
                type="search"
                id="search-input"
                class="search-input"
                placeholder="🔍 Cari cerita..."
                aria-label="Cari cerita tersimpan"
              />
            </div>
            <div class="filter-sort-wrapper">
              <label for="sort-select" class="visually-hidden">Urutkan</label>
              <select id="sort-select" class="sort-select" aria-label="Urutkan cerita">
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name-asc">Nama (A-Z)</option>
                <option value="name-desc">Nama (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        <div id="saved-story-list" class="story-list" role="list" aria-label="Daftar cerita tersimpan">
          <!-- stories rendered here -->
        </div>
      </section>
    `;
  }

  renderStories(stories) {
    const listContainer = this.container.querySelector('#saved-story-list');
    listContainer.innerHTML = '';

    if (!stories || stories.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" role="status">
          <span class="empty-icon">🔖</span>
          <p>Belum ada cerita tersimpan.</p>
          <p class="empty-hint">Tekan ikon bookmark pada cerita untuk menyimpannya.</p>
        </div>
      `;
      return;
    }

    stories.forEach((story) => {
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const article = document.createElement('article');
      article.classList.add('story-card', 'card');
      article.setAttribute('role', 'listitem');
      article.setAttribute('aria-label', `Cerita oleh ${story.name}`);
      article.innerHTML = `
        <img
          src="${story.photoUrl}"
          alt="Foto cerita dari ${story.name}"
          class="story-image"
          loading="lazy"
        >
        <div class="story-info">
          <h2 class="story-author">${story.name}</h2>
          <p class="story-date">${date}</p>
          <p class="story-desc">${story.description}</p>
          <button
            class="btn btn-danger btn-delete"
            data-id="${story.id}"
            aria-label="Hapus cerita dari ${story.name}"
          >
            🗑️ Hapus dari Tersimpan
          </button>
        </div>
      `;
      listContainer.appendChild(article);
    });
  }

  renderPendingCount(count) {
    const banner = this.container.querySelector('#pending-banner');
    const countEl = this.container.querySelector('#pending-count');
    if (count > 0) {
      countEl.textContent = count;
      banner.classList.remove('d-none');
    } else {
      banner.classList.add('d-none');
    }
  }

  showOfflineBanner(isOffline) {
    const banner = this.container.querySelector('#offline-banner');
    if (isOffline) {
      banner.classList.remove('d-none');
    } else {
      banner.classList.add('d-none');
    }
  }

  bindDeleteEvent(handler) {
    const list = this.container.querySelector('#saved-story-list');
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete');
      if (btn) {
        const storyId = btn.dataset.id;
        handler(storyId);
      }
    });
  }

  bindSearchEvent(handler) {
    const input = this.container.querySelector('#search-input');
    input.addEventListener('input', (e) => {
      handler(e.target.value);
    });
  }

  bindSortEvent(handler) {
    const select = this.container.querySelector('#sort-select');
    select.addEventListener('change', (e) => {
      handler(e.target.value);
    });
  }

  bindSyncEvent(handler) {
    const btn = this.container.querySelector('#btn-sync');
    if (btn) {
      btn.addEventListener('click', handler);
    }
  }
}

export default SavedStoriesView;
