class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async waitForVisible(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = BasePage;