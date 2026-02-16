// funcionalidades/pages/ContactListPage.js

const BasePage = require('./BasePage');

/**
 * Page Object para la página de lista de contactos
 */
class ContactListPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectores centralizados
    this.selectors = {
      addContactButton: '#add-contact',
      logoutButton: '#logout',
      contactRow: 'tr.contactTableBodyRow',
      contactTable: '.contactTable'
    };
    
    this.url = 'https://thinking-tester-contact-list.herokuapp.com/contactList';
  }

  /**
   * Hacer clic en Add a New Contact
   */
  async clickAddContact() {
    await this.click(this.selectors.addContactButton);
    await this.waitForNavigation();
  }

  /**
   * Hacer clic en un contacto específico por nombre
   */
  async clickContact(fullName) {
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    await contactRow.click();
    await this.waitForNavigation();
  }

  /**
   * Verificar que un contacto existe en la lista
   */
  async contactExists(fullName) {
    // Esperar a que la tabla esté visible
    await this.page.waitForSelector(this.selectors.contactTable, { timeout: 10000 });
    
    // Esperar un poco más para que se actualice el DOM
    await this.page.waitForTimeout(2000);
    
    // Buscar el contacto
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    
    try {
      await contactRow.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verificar que un contacto NO existe en la lista (con retry logic)
   */
  async contactDoesNotExist(fullName) {
    // Esperar a que la tabla esté visible
    await this.page.waitForSelector(this.selectors.contactTable, { timeout: 10000 });
    
    // Esperar más tiempo para que se actualice el DOM después de eliminar
    await this.page.waitForTimeout(3000);
    
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    
    // Intentar varias veces (retry logic)
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const isVisible = await contactRow.isVisible({ timeout: 2000 });
        
        if (!isVisible) {
          // El contacto NO está visible - ¡bien!
          return true;
        }
        
        // Si todavía está visible, esperar un poco más
        console.log(`⏳ Intento ${i + 1}/${maxRetries}: Contacto todavía visible, esperando...`);
        await this.page.waitForTimeout(2000);
        
      } catch (error) {
        // Si da error al verificar visibilidad, significa que no existe
        return true;
      }
    }
    
    // Después de todos los intentos, verificar una última vez
    try {
      const stillVisible = await contactRow.isVisible({ timeout: 1000 });
      return !stillVisible;
    } catch {
      return true;
    }
  }

  /**
   * Hacer logout
   */
  async logout() {
    await this.click(this.selectors.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Verificar que estamos en la página de contactos
   */
  async isOnContactListPage() {
    return this.getCurrentUrl().includes('contactList');
  }

  /**
   * Verificar que el botón Add Contact es visible
   */
  async isAddContactButtonVisible() {
    return await this.isVisible(this.selectors.addContactButton);
  }
}

module.exports = ContactListPage;