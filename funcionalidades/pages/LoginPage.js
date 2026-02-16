// funcionalidades/pages/LoginPage.js

const BasePage = require('./BasePage');

/**
 * Page Object para la página de Login
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores centralizados
    this.selectors = {
      emailInput: '#email',
      passwordInput: '#password',
      submitButton: '#submit',
      signupLink: '#signup',
      logoutButton: '#logout'
    };
    
    this.url = 'https://thinking-tester-contact-list.herokuapp.com/';
  }

  /**
   * Navegar a la página de login
   */
  async navigate() {
    await this.goto(this.url);
  }

  /**
   * Ingresar email
   */
  async enterEmail(email) {
    await this.fill(this.selectors.emailInput, email);
  }

  /**
   * Ingresar contraseña
   */
  async enterPassword(password) {
    await this.fill(this.selectors.passwordInput, password);
  }

  /**
   * Hacer clic en Submit
   */
  async clickSubmit() {
    await this.click(this.selectors.submitButton);
    await this.waitForNavigation();
  }

  /**
   * Login completo (método de alto nivel)
   */
  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  /**
   * Ir a página de registro
   */
  async goToSignup() {
    await this.click(this.selectors.signupLink);
    await this.waitForNavigation();
  }

  /**
   * Hacer logout
   */
  async logout() {
    await this.click(this.selectors.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Verificar que estamos en la página de login
   */
  async isOnLoginPage() {
    return this.getCurrentUrl().includes(this.url);
  }
}

module.exports = LoginPage;