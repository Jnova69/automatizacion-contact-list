// funcionalidades/pages/SignupPage.js

const BasePage = require('./BasePage');

/**
 * Page Object para la página de Registro
 */
class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores centralizados
    this.selectors = {
      firstNameInput: '#firstName',
      lastNameInput: '#lastName',
      emailInput: '#email',
      passwordInput: '#password',
      submitButton: '#submit',
      cancelButton: '#cancel'
    };
    
    this.url = 'https://thinking-tester-contact-list.herokuapp.com/addUser';
  }

  /**
   * Navegar a la página de registro
   */
  async navigate() {
    await this.goto(this.url);
  }

  /**
   * Ingresar nombre
   */
  async enterFirstName(firstName) {
    await this.fill(this.selectors.firstNameInput, firstName);
  }

  /**
   * Ingresar apellido
   */
  async enterLastName(lastName) {
    await this.fill(this.selectors.lastNameInput, lastName);
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
   * Registro completo (método de alto nivel)
   */
  async signup(firstName, lastName, email, password) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  /**
   * Verificar que estamos en la página de registro
   */
  async isOnSignupPage() {
    return this.getCurrentUrl().includes('addUser');
  }
}

module.exports = SignupPage;