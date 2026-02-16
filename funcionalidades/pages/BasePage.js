// funcionalidades/pages/BasePage.js

/**
 * Clase base para todos los Page Objects
 * Contiene métodos comunes reutilizables
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navegar a una URL
   */
  async goto(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Llenar un campo de texto
   */
  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  /**
   * Hacer clic en un elemento
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Esperar a que un elemento sea visible
   */
  async waitForVisible(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Obtener texto de un elemento
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Verificar si elemento está visible
   */
  async isVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  /**
   * Esperar por navegación
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Obtener URL actual
   */
  getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = BasePage;