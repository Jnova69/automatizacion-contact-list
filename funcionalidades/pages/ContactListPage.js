const BasePage = require('./BasePage');

class ContactListPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      addContactButton: '#add-contact',
      logoutButton: '#logout',
      contactRow: 'tr.contactTableBodyRow',
      contactTable: '.contactTable'
    };
    
    this.url = 'https://thinking-tester-contact-list.herokuapp.com/contactList';
  }

  async clickAddContact() {
    await this.click(this.selectors.addContactButton);
    await this.waitForNavigation();
  }

  async clickContact(fullName) {
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    await contactRow.click();
    await this.waitForNavigation();
  }

  async contactExists(fullName) {
    await this.page.waitForSelector(this.selectors.contactTable, { timeout: 10000 });
    await this.page.waitForTimeout(2000);
    
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    
    try {
      await contactRow.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async contactDoesNotExist(fullName) {
    await this.page.waitForSelector(this.selectors.contactTable, { timeout: 10000 });
    await this.page.waitForTimeout(3000);
    
    const contactRow = this.page.locator(`${this.selectors.contactRow}:has-text("${fullName}")`);
    
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const isVisible = await contactRow.isVisible({ timeout: 2000 });
        
        if (!isVisible) {
          return true;
        }
        
        console.log(`Intento ${i + 1}/${maxRetries}: Contacto todavía visible, esperando...`);
        await this.page.waitForTimeout(2000);
        
      } catch (error) {
        return true;
      }
    }
    
    try {
      const stillVisible = await contactRow.isVisible({ timeout: 1000 });
      return !stillVisible;
    } catch {
      return true;
    }
  }

  async logout() {
    await this.click(this.selectors.logoutButton);
    await this.waitForNavigation();
  }

  async isOnContactListPage() {
    return this.getCurrentUrl().includes('contactList');
  }

  async isAddContactButtonVisible() {
    return await this.isVisible(this.selectors.addContactButton);
  }
}

module.exports = ContactListPage;
