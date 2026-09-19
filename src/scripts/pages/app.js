import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import AuthModel from '../models/auth-model.js';
import {
  subscribePushNotification,
  unsubscribePushNotification,
  isSubscribed,
} from '../utils/notification-helper.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #navList = null;
  #currentPresenter = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navList = document.querySelector('#nav-list');

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isExpanded = this.#drawerButton.getAttribute('aria-expanded') === 'true';
      this.#drawerButton.setAttribute('aria-expanded', !isExpanded);
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#closeDrawer();
      }
    });

    this.#navList.addEventListener('click', async (event) => {
      if (event.target.tagName === 'A') {
        this.#closeDrawer();
      }
      if (event.target.id === 'logout-btn') {
        event.preventDefault();
        AuthModel.removeToken();
        window.location.hash = '#/login';
      }
      if (event.target.id === 'notif-toggle-btn') {
        event.preventDefault();
        await this.#handleNotifToggle(event.target);
      }
    });
  }

  #closeDrawer() {
    this.#navigationDrawer.classList.remove('open');
    this.#drawerButton.setAttribute('aria-expanded', 'false');
  }

  async #renderNav() {
    if (AuthModel.isAuthenticated()) {
      let subscribed = false;
      try {
        subscribed = await isSubscribed();
      } catch (_e) { /* ignore */ }

      this.#navList.innerHTML = `
        <li><a href="#/">Home</a></li>
        <li><a href="#/add-story">Add Story</a></li>
        <li><a href="#/saved-stories">🔖 Saved</a></li>
        <li>
          <button
            id="notif-toggle-btn"
            class="btn btn-notif ${subscribed ? 'btn-notif--active' : ''}"
            aria-label="${subscribed ? 'Nonaktifkan notifikasi push' : 'Aktifkan notifikasi push'}"
            aria-pressed="${subscribed}"
          >
            ${subscribed ? '🔔 Notif ON' : '🔕 Notif OFF'}
          </button>
        </li>
        <li><a href="#" id="logout-btn">Logout</a></li>
      `;
    } else {
      this.#navList.innerHTML = `
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `;
    }
  }

  async #handleNotifToggle(btn) {
    try {
      const subscribed = btn.getAttribute('aria-pressed') === 'true';

      if (subscribed) {
        await unsubscribePushNotification();
        btn.textContent = '🔕 Notif OFF';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Aktifkan notifikasi push');
        btn.classList.remove('btn-notif--active');
      } else {
        await subscribePushNotification();
        btn.textContent = '🔔 Notif ON';
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Nonaktifkan notifikasi push');
        btn.classList.add('btn-notif--active');
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
      alert('Gagal mengubah status notifikasi: ' + error.message);
    }
  }

  async renderPage() {
    await this.#renderNav();
    let url = getActiveRoute();

    // Auth Guard
    const publicRoutes = ['/login', '/register'];
    if (!AuthModel.isAuthenticated() && !publicRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }
    if (AuthModel.isAuthenticated() && publicRoutes.includes(url)) {
      window.location.hash = '#/';
      return;
    }

    const presenterClass = routes[url] || routes['/'];
    
    // View Transition API
    if (!document.startViewTransition) {
      await this.#renderComponent(presenterClass);
    } else {
      document.startViewTransition(async () => {
        await this.#renderComponent(presenterClass);
      });
    }
  }
  
  async #renderComponent(PresenterClass) {
    // cleanup previous presenter if needed
    if (this.#currentPresenter && typeof this.#currentPresenter.destroy === 'function') {
      this.#currentPresenter.destroy();
    }
    
    this.#currentPresenter = new PresenterClass(this.#content);
    await this.#currentPresenter.init();
  }
}

export default App;
