// funcionalidades/definiciones_pasos/login_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// GIVEN - Preparar el escenario
// ============================================

Given('que el usuario está en la página de login', async function () {
  await this.loginPage.navigate();
  console.log('✓ Navegó a la página de login');
});

// ============================================
// WHEN - Acciones del usuario
// ============================================

When('el usuario ingresa email {string}', async function (email) {
  await this.loginPage.enterEmail(email);
  console.log(`✓ Ingresó email: ${email}`);
});

When('el usuario ingresa contraseña {string}', async function (password) {
  await this.loginPage.enterPassword(password);
  console.log('✓ Ingresó contraseña');
});

When('el usuario hace clic en el botón Submit', async function () {
  await this.loginPage.clickSubmit();
  console.log('✓ Hizo clic en Submit');
  console.log('✓ URL actual:', this.loginPage.getCurrentUrl());
});

When('el usuario hace logout', async function () {
  await this.loginPage.logout();
  console.log('✓ Hizo logout exitosamente');
  console.log('✓ Volvió a la página de login');
});

// ============================================
// PASOS PARA USAR CREDENCIALES GUARDADAS
// ============================================

When('el usuario ingresa el email registrado', async function () {
  if (!this.emailRegistrado) {
    throw new Error('❌ No hay email registrado. Debes ejecutar el signup primero.');
  }
  
  await this.loginPage.enterEmail(this.emailRegistrado);
  console.log(`✓ Ingresó email registrado: ${this.emailRegistrado}`);
});

When('el usuario ingresa la contraseña registrada', async function () {
  if (!this.passwordRegistrado) {
    throw new Error('❌ No hay contraseña registrada. Debes ejecutar el signup primero.');
  }
  
  await this.loginPage.enterPassword(this.passwordRegistrado);
  console.log('✓ Ingresó contraseña registrada');
});

// ============================================
// THEN - Verificaciones
// ============================================

Then('debería ver la página de contactos', async function () {
  const isOnContactList = await this.contactListPage.isOnContactListPage();
  expect(isOnContactList).toBe(true);
  console.log('✓ Está en la página de contactos');
});

Then('debería ver el botón {string}', async function (textoBoton) {
  if (textoBoton === 'Add a New Contact') {
    const isVisible = await this.contactListPage.isAddContactButtonVisible();
    expect(isVisible).toBe(true);
    console.log(`✓ El botón "${textoBoton}" es visible`);
  } else {
    // Fallback genérico
    const elemento = this.page.locator(`text=${textoBoton}`);
    await expect(elemento).toBeVisible();
    console.log(`✓ El elemento "${textoBoton}" es visible`);
  }
});