// funcionalidades/step_definitions/signup_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// GIVEN - Preparar el escenario
// ============================================

Given('que el usuario está en la página de registro', async function () {
  await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
  await this.page.waitForLoadState('networkidle');
  
  await this.page.click('#signup');
  await this.page.waitForURL('**/addUser');
  await this.page.waitForLoadState('networkidle');
  
  console.log('✓ Navegó a la página de registro');
});

// ============================================
// WHEN - Acciones del usuario
// ============================================

When('el usuario ingresa nombre {string}', async function (nombre) {
  await this.page.fill('#firstName', nombre);
  console.log(`✓ Ingresó nombre: ${nombre}`);
});

When('el usuario ingresa apellido {string}', async function (apellido) {
  await this.page.fill('#lastName', apellido);
  console.log(`✓ Ingresó apellido: ${apellido}`);
});

When('el usuario ingresa email de registro {string}', async function (email) {
  const timestamp = Date.now();
  const emailFinal = email.replace('{{timestamp}}', timestamp);
  
  this.emailRegistrado = emailFinal;
  
  await this.page.fill('#email', emailFinal);
  console.log(`✓ Ingresó email: ${emailFinal}`);
});

When('el usuario ingresa contraseña de registro {string}', async function (password) {
  this.passwordRegistrado = password;
  
  await this.page.fill('#password', password);
  console.log('✓ Ingresó contraseña');
});

When('el usuario hace clic en el botón de registro', async function () {
  await this.page.click('#submit');
  
  // Esperar a que navegue a contactList
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log('✓ Hizo clic en Submit');
  console.log('✓ URL actual:', this.page.url());
});

// ============================================
// THEN - Verificaciones
// ============================================

Then('debería ver un mensaje de bienvenida', async function () {
  const url = this.page.url();
  expect(url).toContain('contactList');
  
  console.log('✓ Registro exitoso - está en contactList');
});