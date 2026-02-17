const BasePage = require('./BasePage');

class SignupPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores
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

  async navigate() {
    await this.goto(this.url);
  }

  async enterFirstName(firstName) {
    await this.fill(this.selectors.firstNameInput, firstName);
  }

  async enterLastName(lastName) {
    await this.fill(this.selectors.lastNameInput, lastName);
  }

  async enterEmail(email) {
    await this.fill(this.selectors.emailInput, email);
  }

  async enterPassword(password) {
    await this.fill(this.selectors.passwordInput, password);
  }

  async clickSubmit() {
    await this.click(this.selectors.submitButton);
    await this.waitForNavigation();
  }

  async signup(firstName, lastName, email, password) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  async isOnSignupPage() {
    return this.getCurrentUrl().includes('addUser');
  }
}

module.exports = SignupPage;