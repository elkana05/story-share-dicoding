class LoginView {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <section class="auth-section">
        <div class="card auth-card">
          <h1>Welcome Back</h1>
          <p>Login to StoryShare Dicoding</p>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="email" placeholder="mail@example.com">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required autocomplete="current-password" minlength="8" placeholder="min 8 characters">
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
          <p class="auth-footer">Don't have an account? <a href="#/register">Register</a></p>
        </div>
      </section>
    `;
  }

  bindLoginEvent(handler) {
    const form = this.container.querySelector('#login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = this.container.querySelector('#email').value;
      const password = this.container.querySelector('#password').value;
      handler({ email, password });
    });
  }
}

export default LoginView;
