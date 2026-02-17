const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      emailInput: '#email',
      passwordInput: '#password',
      submitButton: '#submit',
      signupLink: '#signup',
      logoutButton: '#logout'
    };
    
    this.url = 'https://thinking-tester-contact-list.herokuapp.com/';
  }

  async navigate() {
    await this.goto(this.url);
  }

  async enterEmail(email) {
    await this.fill(this.selectors.emailInput, email);
  }

  async enterPassword(password) {
    await this.fill(this.selectors.passwordInput, password);
  }

  async clickSubmit() {
    await this.click(this.selectors.submitButton);
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    await this.page.waitForTimeout(3000);
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  async goToSignup() {
    await this.click(this.selectors.signupLink);
    await this.waitForNavigation();
  }

  async logout() {
    await this.click(this.selectors.logoutButton);
    await this.waitForNavigation();
  }

  async isOnLoginPage() {
    return this.getCurrentUrl().includes(this.url);
  }
}

module.exports = LoginPage;