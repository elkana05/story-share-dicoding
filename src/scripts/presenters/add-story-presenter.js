import AddStoryView from '../views/add-story-view.js';
import StoryModel from '../models/story-model.js';
import { addPendingStory } from '../utils/idb-helper.js';
import Swal from 'sweetalert2';

class AddStoryPresenter {
  constructor(contentContainer) {
    this.view = new AddStoryView(contentContainer);
  }

  async init() {
    this.view.render();
    this.view.initMapPicker();
    this.view.bindSubmitEvent(this.handleSubmit.bind(this));
  }

  async handleSubmit({ description, photo, lat, lon }) {
    // If offline, save to IndexedDB pending queue
    if (!navigator.onLine) {
      return this.handleOfflineSubmit({ description, photo, lat, lon });
    }

    try {
      Swal.fire({
        title: 'Uploading Story...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await StoryModel.addNewStory({ description, photo, lat, lon });
      
      Swal.close();
      await Swal.fire('Success! 🎉', 'Story berhasil diposting!', 'success');
      window.location.hash = '#/';
    } catch (error) {
      Swal.close();

      // If network error while thinking we're online, try offline save
      if (!navigator.onLine || error.message.includes('fetch')) {
        return this.handleOfflineSubmit({ description, photo, lat, lon });
      }
      Swal.fire('Error', error.message, 'error');
    }
  }

  async handleOfflineSubmit({ description, photo, lat, lon }) {
    try {
      await addPendingStory({ description, photo, lat, lon });
      await Swal.fire({
        title: 'Tersimpan Offline 📦',
        html: `
          <p>Anda sedang offline. Cerita Anda telah disimpan dan akan dikirim otomatis saat koneksi kembali.</p>
          <p>Anda juga bisa melakukan sinkronisasi manual dari halaman <strong>Saved Stories</strong>.</p>
        `,
        icon: 'info',
      });
      window.location.hash = '#/saved-stories';
    } catch (error) {
      Swal.fire('Error', 'Gagal menyimpan cerita secara offline: ' + error.message, 'error');
    }
  }

  destroy() {
    this.view.destroy();
  }
}

export default AddStoryPresenter;
