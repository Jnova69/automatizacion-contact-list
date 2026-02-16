// funcionalidades/pages/ContactDetailsPage.js

const BasePage = require('./BasePage');

/**
 * Page Object para la página de detalles del contacto
 */
class ContactDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores centralizados
    this.selectors = {
      editContactButton: 'button:has-text("Edit Contact")',
      deleteContactButton: 'button:has-text("Delete Contact")',
      returnButton: 'button:has-text("Return to Contact List")'
    };
  }

  /**
   * Hacer clic en Edit Contact
   */
  async clickEditContact() {
    await this.click(this.selectors.editContactButton);
    await this.waitForNavigation();
  }

  /**
   * Hacer clic en Delete Contact
   */
  async clickDeleteContact() {
    // Configurar manejador de diálogo ANTES de hacer clic
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    await this.click(this.selectors.deleteContactButton);
    await this.waitForNavigation();
  }

  /**
   * Regresar a la lista de contactos
   */
  async returnToContactList() {
    await this.click(this.selectors.returnButton);
    await this.waitForNavigation();
  }

  /**
   * Verificar que un dato específico es visible
   */
  async isDataVisible(data) {
    return await this.isVisible(`text=${data}`);
  }

  /**
   * Verificar que estamos en página de detalles
   */
  async isOnContactDetailsPage() {
    return this.getCurrentUrl().includes('contactDetails');
  }
}

module.exports = ContactDetailsPage;