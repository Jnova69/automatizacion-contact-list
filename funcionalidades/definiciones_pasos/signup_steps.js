// funcionalidades/definiciones_pasos/signup_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// GIVEN - Preparar el escenario
// ============================================

Given('que el usuario está en la página de registro', async function () {
  // Navegar a login primero
  await this.loginPage.navigate();
  
  // Luego ir a signup
  await this.loginPage.goToSignup();
  
  console.log('✓ Navegó a la página de registro');
});

// ============================================
// WHEN - Acciones del usuario
// ============================================

When('el usuario ingresa nombre {string}', async function (nombre) {
  await this.signupPage.enterFirstName(nombre);
  console.log(`✓ Ingresó nombre: ${nombre}`);
});

When('el usuario ingresa apellido {string}', async function (apellido) {
  await this.signupPage.enterLastName(apellido);
  console.log(`✓ Ingresó apellido: ${apellido}`);
});

When('el usuario ingresa email de registro {string}', async function (email) {
  // Generar timestamp único
  const timestamp = Date.now();
  const emailFinal = email.replace('{{timestamp}}', timestamp);
  
  // Guardar para uso posterior
  this.emailRegistrado = emailFinal;
  
  await this.signupPage.enterEmail(emailFinal);
  console.log(`✓ Ingresó email: ${emailFinal}`);
});

When('el usuario ingresa contraseña de registro {string}', async function (password) {
  // Guardar para uso posterior
  this.passwordRegistrado = password;
  
  await this.signupPage.enterPassword(password);
  console.log('✓ Ingresó contraseña');
});

When('el usuario hace clic en el botón de registro', async function () {
  await this.signupPage.clickSubmit();
  console.log('✓ Hizo clic en Submit');
  console.log('✓ URL actual:', this.signupPage.getCurrentUrl());
});

// ============================================
// THEN - Verificaciones
// ============================================

Then('debería ver un mensaje de bienvenida', async function () {
  const isOnContactList = await this.contactListPage.isOnContactListPage();
  expect(isOnContactList).toBe(true);
  console.log('✓ Registro exitoso - está en contactList');
});