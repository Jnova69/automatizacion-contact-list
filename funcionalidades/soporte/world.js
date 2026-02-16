// funcionalidades/soporte/world.js

const { 
  setWorldConstructor, 
  Before, 
  After, 
  Status,
  setDefaultTimeout  // ← AGREGAR ESTO
} = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

// Importar Page Objects
const LoginPage = require('../pages/LoginPage');
const SignupPage = require('../pages/SignupPage');
const ContactListPage = require('../pages/ContactListPage');
const AddContactPage = require('../pages/AddContactPage');
const ContactDetailsPage = require('../pages/ContactDetailsPage');

// ============================================
// TIMEOUT GLOBAL - SOLUCIÓN PROFESIONAL
// ============================================
setDefaultTimeout(120000);  // 2 minutos para todos los steps

// Configuración según el entorno
const config = {
  // Si HEADLESS no está definido o es 'false', mostrar navegador
  headless: process.env.HEADLESS === 'true' ? true : false,
  // SlowMo: 0 por defecto (rápido), 300 para demos
  slowMo: parseInt(process.env.SLOWMO || '100')
};

console.log('🔧 Configuración Playwright:', config);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    
    // Page Objects (se inicializan en Before)
    this.loginPage = null;
    this.signupPage = null;
    this.contactListPage = null;
    this.addContactPage = null;
    this.contactDetailsPage = null;
    
    // Datos compartidos entre pasos
    this.emailRegistrado = null;
    this.passwordRegistrado = null;
    this.apiToken = null;
    this.ultimoContacto = null;
    this.contactoCreado = null;
    this.telefonoModificado = null;
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  this.browser = await chromium.launch({
    headless: config.headless,
    slowMo: config.slowMo
  });
  
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  
  // Inicializar Page Objects
  this.loginPage = new LoginPage(this.page);
  this.signupPage = new SignupPage(this.page);
  this.contactListPage = new ContactListPage(this.page);
  this.addContactPage = new AddContactPage(this.page);
  this.contactDetailsPage = new ContactDetailsPage(this.page);
  
  console.log('✅ Page Objects inicializados');
});

After(async function (scenario) {
  // Si la prueba falló, tomar screenshot
  if (scenario.result.status === Status.FAILED) {
    const screenshotPath = `test-results/FAILED_${scenario.pickle.name.replace(/[^a-z0-9]/gi, '_')}.png`;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`📸 Screenshot guardado: ${screenshotPath}`);
  }
  
  // Cerrar todo
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});