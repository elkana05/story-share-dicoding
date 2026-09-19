import HomePresenter from '../presenters/home-presenter.js';
import LoginPresenter from '../presenters/login-presenter.js';
import RegisterPresenter from '../presenters/register-presenter.js';
import AddStoryPresenter from '../presenters/add-story-presenter.js';
import SavedStoriesPresenter from '../presenters/saved-stories-presenter.js';

const routes = {
  '/': HomePresenter,
  '/login': LoginPresenter,
  '/register': RegisterPresenter,
  '/add-story': AddStoryPresenter,
  '/saved-stories': SavedStoriesPresenter,
};

export default routes;
