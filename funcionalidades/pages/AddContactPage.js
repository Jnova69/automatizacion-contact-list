const BasePage = require('./BasePage');

class AddContactPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      firstNameInput: '#firstName',
      lastNameInput: '#lastName',
      birthdateInput: '#birthdate',
      emailInput: '#email',
      phoneInput: '#phone',
      street1Input: '#street1',
      street2Input: '#street2',
      cityInput: '#city',
      stateProvinceInput: '#stateProvince',
      postalCodeInput: '#postalCode',
      countryInput: '#country',
      submitButton: '#submit',
      cancelButton: '#cancel'
    };
  }

  async fillContactForm(contactData) {
    if (contactData.firstName) await this.fill(this.selectors.firstNameInput, contactData.firstName);
    if (contactData.lastName) await this.fill(this.selectors.lastNameInput, contactData.lastName);
    if (contactData.birthdate) await this.fill(this.selectors.birthdateInput, contactData.birthdate);
    if (contactData.email) await this.fill(this.selectors.emailInput, contactData.email);
    if (contactData.phone) await this.fill(this.selectors.phoneInput, contactData.phone);
    if (contactData.street1) await this.fill(this.selectors.street1Input, contactData.street1);
    if (contactData.street2) await this.fill(this.selectors.street2Input, contactData.street2);
    if (contactData.city) await this.fill(this.selectors.cityInput, contactData.city);
    if (contactData.stateProvince) await this.fill(this.selectors.stateProvinceInput, contactData.stateProvince);
    if (contactData.postalCode) await this.fill(this.selectors.postalCodeInput, contactData.postalCode);
    if (contactData.country) await this.fill(this.selectors.countryInput, contactData.country);
  }

  async updatePhone(phone) {
    await this.fill(this.selectors.phoneInput, '');
    await this.fill(this.selectors.phoneInput, phone);
  }

  async clickSubmit() {
    await this.click(this.selectors.submitButton);
    await this.waitForNavigation();
  }

  async clickCancel() {
    await this.click(this.selectors.cancelButton);
    await this.waitForNavigation();
  }

  async createContact(contactData) {
    await this.fillContactForm(contactData);
    await this.clickSubmit();
  }

  async isOnAddContactPage() {
    const url = this.getCurrentUrl();
    return url.includes('addContact') || url.includes('editContact');
  }
}

module.exports = AddContactPage;
