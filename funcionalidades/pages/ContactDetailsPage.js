const BasePage = require('./BasePage');

class ContactDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.selectors = {
      editContactButton: 'button:has-text("Edit Contact")',
      deleteContactButton: 'button:has-text("Delete Contact")',
      returnButton: 'button:has-text("Return to Contact List")'
    };
  }

  async clickEditContact() {
    await this.click(this.selectors.editContactButton);
    await this.waitForNavigation();
  }

  async clickDeleteContact() {
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
    
    await this.click(this.selectors.deleteContactButton);
    await this.waitForNavigation();
  }

  async returnToContactList() {
    await this.click(this.selectors.returnButton);
    await this.waitForNavigation();
  }

  async isDataVisible(data) {
    return await this.isVisible(`text=${data}`);
  }

  async isOnContactDetailsPage() {
    return this.getCurrentUrl().includes('contactDetails');
  }
}

module.exports = ContactDetailsPage;
