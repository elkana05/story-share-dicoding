import LoginView from '../views/login-view.js';
import AuthModel from '../models/auth-model.js';
import Swal from 'sweetalert2';

class LoginPresenter {
  constructor(contentContainer) {
    this.view = new LoginView(contentContainer);
  }

  async init() {
    this.view.render();
    this.view.bindLoginEvent(this.handleLogin.bind(this));
  }

  async handleLogin({ email, password }) {
    try {
      Swal.fire({
        title: 'Logging in...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await AuthModel.login({ email, password });
      
      Swal.close();
      await Swal.fire('Success', 'Logged in successfully!', 'success');
      window.location.hash = '#/';
      window.location.reload(); // To refresh navigation state
    } catch (error) {
      Swal.close();
      Swal.fire('Error', error.message, 'error');
    }
  }
}

export default LoginPresenter;
