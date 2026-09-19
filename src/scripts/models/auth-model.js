import CONFIG from '../config.js';

class AuthModel {
  static getToken() {
    return localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  }

  static setToken(token) {
    localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    
    this.setToken(responseJson.loginResult.token);
    return responseJson;
  }

  static async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    
    return responseJson;
  }
}

export default AuthModel;
