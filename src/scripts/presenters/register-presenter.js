import RegisterView from '../views/register-view.js';
import AuthModel from '../models/auth-model.js';
import Swal from 'sweetalert2';

class RegisterPresenter {
  constructor(contentContainer) {
    this.view = new RegisterView(contentContainer);
  }

  async init() {
    this.view.render();
    this.view.bindRegisterEvent(this.handleRegister.bind(this));
  }

  async handleRegister({ name, email, password }) {
    try {
      Swal.fire({
        title: 'Registering...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await AuthModel.register({ name, email, password });
      
      Swal.close();
      await Swal.fire('Success', 'Account created successfully! Please login.', 'success');
      window.location.hash = '#/login';
    } catch (error) {
      Swal.close();
      Swal.fire('Error', error.message, 'error');
    }
  }
}

export default RegisterPresenter;
