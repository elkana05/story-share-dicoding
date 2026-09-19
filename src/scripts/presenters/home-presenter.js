import HomeView from '../views/home-view.js';
import StoryModel from '../models/story-model.js';
import { getSavedStories, saveStory, deleteSavedStory } from '../utils/idb-helper.js';
import Swal from 'sweetalert2';

class HomePresenter {
  constructor(contentContainer) {
    this.view = new HomeView(contentContainer);
    this.stories = [];
  }

  async init() {
    this.view.render();
    await this.loadStories();
  }

  async loadStories() {
    try {
      this.stories = await StoryModel.getAllStories({ location: 1 });
      const savedStories = await getSavedStories();
      const savedIds = new Set(savedStories.map((s) => s.id));
      this.view.renderStories(this.stories, savedIds);
      this.view.initMap(this.stories);
      this.view.bindSaveEvent(this.handleSaveToggle.bind(this));
    } catch (error) {
      Swal.fire('Error', 'Failed to load stories: ' + error.message, 'error');
    }
  }

  async handleSaveToggle(storyData, isSaved, btn) {
    try {
      if (isSaved) {
        await deleteSavedStory(storyData.id);
        this.view.updateBookmarkButton(btn, false);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'Cerita dihapus dari tersimpan',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await saveStory(storyData);
        this.view.updateBookmarkButton(btn, true);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: '🔖 Cerita berhasil disimpan!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui bookmark: ' + error.message, 'error');
    }
  }

  destroy() {
    this.view.destroy();
  }
}

export default HomePresenter;
