// features/support/world.js
// Este archivo configura el "mundo" donde corren las pruebas

const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Clase que representa el "contexto" de cada prueba
class CustomWorld {
  constructor() {
    this.browser = null;    // El navegador
    this.context = null;    // El contexto del navegador
    this.page = null;       // La página web
  }
}

// Le decimos a Cucumber que use nuestra clase personalizada
setWorldConstructor(CustomWorld);

// ANTES de cada escenario: abrir el navegador
Before(async function () {
  this.browser = await chromium.launch({
    headless: false,  // false = ves el navegador (útil para desarrollo)
    slowMo: 100       // Ralentiza acciones para que las veas
  });
  
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

// DESPUÉS de cada escenario: cerrar el navegador
After(async function () {
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});