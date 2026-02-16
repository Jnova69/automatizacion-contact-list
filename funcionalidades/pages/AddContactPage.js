// funcionalidades/pages/AddContactPage.js

const BasePage = require('./BasePage');

/**
 * Page Object para la página de agregar/editar contacto
 */
class AddContactPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores centralizados
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

  /**
   * Llenar el formulario completo de contacto
   */
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

  /**
   * Actualizar solo el teléfono
   */
  async updatePhone(phone) {
    await this.fill(this.selectors.phoneInput, '');
    await this.fill(this.selectors.phoneInput, phone);
  }

  /**
   * Hacer clic en Submit
   */
  async clickSubmit() {
    await this.click(this.selectors.submitButton);
    await this.waitForNavigation();
  }

  /**
   * Hacer clic en Cancel
   */
  async clickCancel() {
    await this.click(this.selectors.cancelButton);
    await this.waitForNavigation();
  }

  /**
   * Crear contacto completo (método de alto nivel)
   */
  async createContact(contactData) {
    await this.fillContactForm(contactData);
    await this.clickSubmit();
  }

  /**
   * Verificar que estamos en página de agregar/editar contacto
   */
  async isOnAddContactPage() {
    const url = this.getCurrentUrl();
    return url.includes('addContact') || url.includes('editContact');
  }
}

module.exports = AddContactPage;