class RegisterView {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="auth-section">
        <div class="card auth-card">
          <h1>Create Account</h1>
          <p>Join StoryShare Dicoding today!</p>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required placeholder="John Doe">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="email" placeholder="mail@example.com">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required autocomplete="new-password" minlength="8" placeholder="min 8 characters">
            </div>
            <button type="submit" class="btn btn-primary w-100">Register</button>
          </form>
          <p class="auth-footer">Already have an account? <a href="#/login">Login</a></p>
        </div>
      </section>
    `;
  }

  bindRegisterEvent(handler) {
    const form = this.container.querySelector('#register-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.container.querySelector('#name').value;
      const email = this.container.querySelector('#email').value;
      const password = this.container.querySelector('#password').value;
      handler({ name, email, password });
    });
  }
}

export default RegisterView;
