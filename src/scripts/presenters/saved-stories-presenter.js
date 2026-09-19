import SavedStoriesView from '../views/saved-stories-view.js';
import StoryModel from '../models/story-model.js';
import {
  getSavedStories,
  deleteSavedStory,
  getPendingStories,
  deletePendingStory,
  getPendingCount,
} from '../utils/idb-helper.js';
import Swal from 'sweetalert2';

class SavedStoriesPresenter {
  constructor(contentContainer) {
    this.view = new SavedStoriesView(contentContainer);
    this.allStories = [];
    this.currentQuery = '';
    this.currentSort = 'newest';
  }

  async init() {
    this.view.render();
    await this.loadSavedStories();
    this.bindEvents();
    this.checkOfflineStatus();
    await this.updatePendingCount();
  }

  async loadSavedStories() {
    try {
      this.allStories = await getSavedStories();
      this.applyFilters();
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat cerita tersimpan: ' + error.message, 'error');
    }
  }

  applyFilters() {
    let filtered = [...this.allStories];

    // Search filter
    if (this.currentQuery.trim()) {
      const q = this.currentQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (this.currentSort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    this.view.renderStories(filtered);
  }

  bindEvents() {
    this.view.bindDeleteEvent(this.handleDelete.bind(this));
    this.view.bindSearchEvent(this.handleSearch.bind(this));
    this.view.bindSortEvent(this.handleSort.bind(this));
    this.view.bindSyncEvent(this.syncPendingStories.bind(this));
  }

  async handleDelete(storyId) {
    const result = await Swal.fire({
      title: 'Hapus Cerita?',
      text: 'Cerita ini akan dihapus dari daftar tersimpan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    });

    if (result.isConfirmed) {
      await deleteSavedStory(storyId);
      await this.loadSavedStories();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cerita berhasil dihapus dari tersimpan',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  handleSearch(query) {
    this.currentQuery = query;
    this.applyFilters();
  }

  handleSort(sortOption) {
    this.currentSort = sortOption;
    this.applyFilters();
  }

  checkOfflineStatus() {
    const isOffline = !navigator.onLine;
    this.view.showOfflineBanner(isOffline);

    window.addEventListener('online', () => this.view.showOfflineBanner(false));
    window.addEventListener('offline', () => this.view.showOfflineBanner(true));
  }

  async updatePendingCount() {
    const count = await getPendingCount();
    this.view.renderPendingCount(count);
  }

  async syncPendingStories() {
    if (!navigator.onLine) {
      Swal.fire('Offline', 'Anda masih offline. Silakan coba lagi saat online.', 'warning');
      return;
    }

    const pendingStories = await getPendingStories();
    if (pendingStories.length === 0) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Tidak ada cerita yang perlu disinkronkan',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    Swal.fire({
      title: `Menyinkronkan ${pendingStories.length} cerita...`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    let successCount = 0;
    let failCount = 0;

    for (const pending of pendingStories) {
      try {
        await StoryModel.addNewStory({
          description: pending.description,
          photo: pending.photo,
          lat: pending.lat,
          lon: pending.lon,
        });
        await deletePendingStory(pending.localId);
        successCount++;
      } catch (_e) {
        failCount++;
      }
    }

    Swal.close();
    await this.updatePendingCount();

    if (failCount === 0) {
      Swal.fire(
        'Sinkronisasi Berhasil! 🎉',
        `${successCount} cerita berhasil dikirim ke server.`,
        'success'
      );
    } else {
      Swal.fire(
        'Sinkronisasi Sebagian',
        `${successCount} berhasil, ${failCount} gagal dikirim.`,
        'warning'
      );
    }
  }
}

export default SavedStoriesPresenter;
