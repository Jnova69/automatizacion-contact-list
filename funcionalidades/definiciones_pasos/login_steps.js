// funcionalidades/step_definitions/login_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// GIVEN - Preparar el escenario
// ============================================

Given('que el usuario está en la página de login', async function () {
  await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
  await this.page.waitForLoadState('networkidle');
  
  console.log('✓ Navegó a la página de login');
});

// ============================================
// WHEN - Acciones del usuario
// ============================================

When('el usuario ingresa email {string}', async function (email) {
  await this.page.fill('#email', email);
  console.log(`✓ Ingresó email: ${email}`);
});

When('el usuario ingresa contraseña {string}', async function (password) {
  await this.page.fill('#password', password);
  console.log('✓ Ingresó contraseña');
});

When('el usuario hace clic en el botón Submit', async function () {
  await this.page.click('#submit');
  
  // Esperar a que navegue a contactList
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log('✓ Hizo clic en Submit');
  console.log('✓ URL actual:', this.page.url());
});

// ============================================
// PASOS PARA USAR CREDENCIALES GUARDADAS
// (del registro previo)
// ============================================

When('el usuario ingresa el email registrado', async function () {
  if (!this.emailRegistrado) {
    throw new Error('❌ No hay email registrado. Debes ejecutar el signup primero en el mismo escenario.');
  }
  
  await this.page.fill('#email', this.emailRegistrado);
  console.log(`✓ Ingresó email registrado: ${this.emailRegistrado}`);
});

When('el usuario ingresa la contraseña registrada', async function () {
  if (!this.passwordRegistrado) {
    throw new Error('❌ No hay contraseña registrada. Debes ejecutar el signup primero en el mismo escenario.');
  }
  
  await this.page.fill('#password', this.passwordRegistrado);
  console.log('✓ Ingresó contraseña registrada');
});

// ============================================
// LOGOUT
// ============================================

When('el usuario hace logout', async function () {
  // Usar el ID exacto que identificaste
  await this.page.click('#logout');
  
  // Esperar a que regrese a la página de login
  await this.page.waitForURL('https://thinking-tester-contact-list.herokuapp.com/', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log('✓ Hizo logout exitosamente');
  console.log('✓ Volvió a la página de login');
});
// ============================================
// THEN - Verificaciones
// ============================================

Then('debería ver la página de contactos', async function () {
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('contactList');
  
  console.log(`✓ Está en la página de contactos`);
});

Then('debería ver el botón {string}', async function (textoBoton) {
  const elemento = this.page.locator(`text=${textoBoton}`);
  await expect(elemento).toBeVisible({ timeout: 5000 });
  
  console.log(`✓ El elemento "${textoBoton}" es visible`);
});