import StoryDetailView from '../views/story-detail-view.js';
import StoryModel from '../models/story-model.js';
import { parseActivePathname } from '../routes/url-parser.js';

class StoryDetailPresenter {
  #container;
  #view;

  constructor(container) {
    this.#container = container;
    this.#view = new StoryDetailView(container);
  }

  async init() {
    const { id } = parseActivePathname();

    if (!id) {
      this.#view.showError('ID cerita tidak ditemukan.');
      return;
    }

    this.#view.showLoading();

    try {
      const story = await StoryModel.getStoryById(id);
      this.#view.showStory(story);
    } catch (error) {
      console.error('Failed to load story detail:', error);
      this.#view.showError(error.message);
    }
  }
}

export default StoryDetailPresenter;
