// funcionalidades/definiciones_pasos/contactos_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// BACKGROUND - Usuario registrado y autenticado
// ============================================

Given('que el usuario está registrado y autenticado', async function () {
  // Generar credenciales únicas
  const timestamp = Date.now();
  this.emailRegistrado = `test_${timestamp}@example.com`;
  this.passwordRegistrado = 'Password123';
  
  // Navegar directamente a la página de registro
  await this.signupPage.navigate();
  
  // Registrar usuario
  await this.signupPage.signup('Test', 'User', this.emailRegistrado, this.passwordRegistrado);
  
  // Esperar a estar en contactList (con timeout largo)
  await this.page.waitForURL('**/contactList', { timeout: 15000 });
  
  console.log(`✓ Usuario registrado y autenticado: ${this.emailRegistrado}`);
});

// ============================================
// NAVEGACIÓN
// ============================================

When('el usuario hace clic en {string}', async function (texto) {
  if (texto === 'Add a New Contact') {
    await this.contactListPage.clickAddContact();
    console.log('✓ Hizo clic en: Add a New Contact');
    return;
  }
  
  if (texto === 'Edit Contact') {
    await this.contactDetailsPage.clickEditContact();
    console.log('✓ Hizo clic en: Edit Contact');
    return;
  }
  
  if (texto === 'Delete Contact') {
    await this.contactDetailsPage.clickDeleteContact();
    console.log('✓ Hizo clic en: Delete Contact');
    return;
  }
  
  if (texto === 'Return to Contact List') {
    await this.contactDetailsPage.returnToContactList();
    console.log('✓ Regresó a la lista de contactos');
    return;
  }
  
  // Fallback genérico
  await this.page.click(`text=${texto}`);
  await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  console.log(`✓ Hizo clic en: ${texto}`);
});

// ============================================
// CREAR CONTACTO
// ============================================

When('el usuario llena el formulario de contacto con:', async function (dataTable) {
  const datos = dataTable.rowsHash();
  
  // Usar el Page Object para llenar el formulario
  await this.addContactPage.fillContactForm(datos);
  
  // Guardar para verificación posterior
  this.ultimoContacto = datos;
  
  console.log('✓ Formulario de contacto llenado');
});

When('el usuario hace clic en el botón {string}', async function (textoBoton) {
  if (textoBoton === 'Submit') {
    await this.addContactPage.clickSubmit();
  } else if (textoBoton === 'Cancel') {
    await this.addContactPage.clickCancel();
  } else {
    // Fallback
    await this.page.click(`button:has-text("${textoBoton}")`);
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }
  
  console.log(`✓ Hizo clic en botón: ${textoBoton}`);
});

Then('debería ver el contacto {string} en la lista', async function (nombreCompleto) {
  // Esperar con timeout largo
  const exists = await this.contactListPage.contactExists(nombreCompleto);
  expect(exists).toBe(true);
  console.log(`✓ Contacto "${nombreCompleto}" visible en la lista`);
});

Then('debería poder ver los detalles del contacto', async function () {
  // Hacer clic en el contacto recién creado
  const nombreCompleto = `${this.ultimoContacto.firstName} ${this.ultimoContacto.lastName}`;
  await this.contactListPage.clickContact(nombreCompleto);
  
  // Verificar que estamos en la página de detalles
  const isOnDetails = await this.contactDetailsPage.isOnContactDetailsPage();
  expect(isOnDetails).toBe(true);
  
  console.log('✓ Está en la página de detalles del contacto');
});

// ============================================
// EDITAR CONTACTO
// ============================================

Given('que existe un contacto llamado {string}', async function (nombreCompleto) {
  // Hacer clic en Add Contact
  await this.contactListPage.clickAddContact();
  
  // Esperar a estar en la página
  await this.page.waitForURL('**/addContact', { timeout: 15000 });
  
  // Separar nombre y apellido
  const [firstName, lastName] = nombreCompleto.split(' ');
  
  // Crear contacto
  const contactData = {
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}@email.com`,
    phone: '3001234567'
  };
  
  await this.addContactPage.createContact(contactData);
  
  // Esperar a volver a la lista
  await this.page.waitForURL('**/contactList', { timeout: 15000 });
  
  console.log(`✓ Contacto "${nombreCompleto}" creado`);
});

When('el usuario hace clic en el contacto {string}', async function (nombreCompleto) {
  await this.contactListPage.clickContact(nombreCompleto);
  
  // Esperar a estar en detalles
  await this.page.waitForURL('**/contactDetails**', { timeout: 15000 });
  
  console.log(`✓ Hizo clic en contacto: ${nombreCompleto}`);
});

When('el usuario modifica el teléfono a {string}', async function (nuevoTelefono) {
  await this.addContactPage.updatePhone(nuevoTelefono);
  this.telefonoModificado = nuevoTelefono;
  console.log(`✓ Modificó teléfono a: ${nuevoTelefono}`);
});

Then('debería ver el contacto actualizado con teléfono {string}', async function (telefono) {
  // Esperar a estar en detalles con timeout largo
  await this.page.waitForURL('**/contactDetails**', { timeout: 15000 });
  await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // Esperar un poco más para que se actualice el DOM
  await this.page.waitForTimeout(2000);
  
  // Verificar que estamos en detalles
  const isOnDetails = await this.contactDetailsPage.isOnContactDetailsPage();
  expect(isOnDetails).toBe(true);
  
  // Verificar que el teléfono es visible
  const isVisible = await this.contactDetailsPage.isDataVisible(telefono);
  expect(isVisible).toBe(true);
  
  console.log(`✓ Teléfono actualizado correctamente: ${telefono}`);
});

// ============================================
// ELIMINAR CONTACTO
// ============================================

Then('no debería ver el contacto {string} en la lista', async function (nombreCompleto) {
  // Esperar a volver a la lista
  await this.page.waitForURL('**/contactList', { timeout: 15000 });
  await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  
  // El método contactDoesNotExist ya tiene retry logic (hasta 13 segundos)
  const doesNotExist = await this.contactListPage.contactDoesNotExist(nombreCompleto);
  expect(doesNotExist).toBe(true);
  console.log(`✓ Contacto "${nombreCompleto}" eliminado correctamente`);
});

// ============================================
// VALIDACIONES
// ============================================

When('el usuario llena solo el apellido {string}', async function (apellido) {
  await this.addContactPage.fillContactForm({ lastName: apellido });
  console.log(`✓ Llenó solo el apellido: ${apellido}`);
});

Then('debería ver un mensaje de error', async function () {
  // Esperar un poco para que aparezca el error
  await this.page.waitForTimeout(2000);
  
  // Buscar mensajes de error comunes
  const errorSelectors = [
    '#error',
    '.error',
    '[class*="error"]',
    'text=required',
    'text=Required'
  ];
  
  let errorFound = false;
  
  for (const selector of errorSelectors) {
    try {
      const errorElement = this.page.locator(selector).first();
      if (await errorElement.isVisible({ timeout: 3000 })) {
        errorFound = true;
        const errorText = await errorElement.textContent();
        console.log(`✓ Mensaje de error encontrado: ${errorText}`);
        break;
      }
    } catch (e) {
      // Continuar con siguiente selector
    }
  }
  
  // Si no encontró error visible, verificar que no navegó
  if (!errorFound) {
    const isStillOnAddPage = await this.addContactPage.isOnAddContactPage();
    errorFound = isStillOnAddPage;
    if (errorFound) {
      console.log('✓ Se quedó en la página de agregar contacto (indica error de validación)');
    }
  }
  
  expect(errorFound).toBe(true);
});

Then('el contacto no debería ser creado', async function () {
  const isStillOnAddPage = await this.addContactPage.isOnAddContactPage();
  expect(isStillOnAddPage).toBe(true);
  console.log('✓ El contacto no fue creado (seguimos en addContact)');
});