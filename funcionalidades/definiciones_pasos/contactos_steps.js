// funcionalidades/step_definitions/contactos_steps.js

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// ============================================
// BACKGROUND - Usuario registrado y autenticado
// ============================================

Given('que el usuario está registrado y autenticado', async function () {
  // Navegar a la página principal
  await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/');
  await this.page.waitForLoadState('networkidle');
  
  // Hacer clic en Sign up
  await this.page.click('#signup');
  await this.page.waitForURL('**/addUser');
  
  // Registrar usuario con timestamp único
  const timestamp = Date.now();
  this.emailRegistrado = `test_${timestamp}@example.com`;
  this.passwordRegistrado = 'Password123';
  
  await this.page.fill('#firstName', 'Test');
  await this.page.fill('#lastName', 'User');
  await this.page.fill('#email', this.emailRegistrado);
  await this.page.fill('#password', this.passwordRegistrado);
  await this.page.click('#submit');
  
  // Esperar a estar en contactList
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log(`✓ Usuario registrado y autenticado: ${this.emailRegistrado}`);
});

// ============================================
// NAVEGACIÓN
// ============================================

When('el usuario hace clic en {string}', async function (texto) {
  // Manejar casos especiales
  if (texto === 'Add a New Contact') {
    await this.page.click('#add-contact');
    await this.page.waitForLoadState('networkidle');
    console.log('✓ Hizo clic en: Add a New Contact');
    return;
  }
  
  if (texto === 'Edit Contact') {
    await this.page.click('button:has-text("Edit Contact")');
    await this.page.waitForLoadState('networkidle');
    console.log('✓ Hizo clic en: Edit Contact');
    return;
  }
  
  if (texto === 'Delete Contact') {
    // Configurar manejador de diálogo ANTES de hacer clic
    this.page.once('dialog', async dialog => {
      console.log(`✓ Diálogo detectado: ${dialog.message()}`);
      await dialog.accept();
    });
    
    await this.page.click('button:has-text("Delete Contact")');
    await this.page.waitForLoadState('networkidle');
    console.log('✓ Hizo clic en: Delete Contact');
    return;
  }
  
  if (texto === 'Return to Contact List') {
    await this.page.click('button:has-text("Return to Contact List")');
    await this.page.waitForURL('**/contactList', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    console.log('✓ Regresó a la lista de contactos');
    return;
  }
  
  // Para otros casos, buscar por texto
  await this.page.click(`text=${texto}`);
  await this.page.waitForLoadState('networkidle');
  console.log(`✓ Hizo clic en: ${texto}`);
});

// ============================================
// CREAR CONTACTO
// ============================================

When('el usuario llena el formulario de contacto con:', async function (dataTable) {
  // dataTable.rowsHash() convierte la tabla en objeto
  const datos = dataTable.rowsHash();
  
  // Llenar cada campo usando los IDs correctos
  if (datos.firstName) {
    await this.page.fill('#firstName', datos.firstName);
    console.log(`✓ firstName: ${datos.firstName}`);
  }
  
  if (datos.lastName) {
    await this.page.fill('#lastName', datos.lastName);
    console.log(`✓ lastName: ${datos.lastName}`);
  }
  
  if (datos.birthdate) {
    await this.page.fill('#birthdate', datos.birthdate);
    console.log(`✓ birthdate: ${datos.birthdate}`);
  }
  
  if (datos.email) {
    await this.page.fill('#email', datos.email);
    console.log(`✓ email: ${datos.email}`);
  }
  
  if (datos.phone) {
    await this.page.fill('#phone', datos.phone);
    console.log(`✓ phone: ${datos.phone}`);
  }
  
  if (datos.street1) {
    await this.page.fill('#street1', datos.street1);
    console.log(`✓ street1: ${datos.street1}`);
  }
  
  if (datos.street2) {
    await this.page.fill('#street2', datos.street2);
    console.log(`✓ street2: ${datos.street2}`);
  }
  
  if (datos.city) {
    await this.page.fill('#city', datos.city);
    console.log(`✓ city: ${datos.city}`);
  }
  
  if (datos.stateProvince) {
    await this.page.fill('#stateProvince', datos.stateProvince);
    console.log(`✓ stateProvince: ${datos.stateProvince}`);
  }
  
  if (datos.postalCode) {
    await this.page.fill('#postalCode', datos.postalCode);
    console.log(`✓ postalCode: ${datos.postalCode}`);
  }
  
  if (datos.country) {
    await this.page.fill('#country', datos.country);
    console.log(`✓ country: ${datos.country}`);
  }
  
  // Guardar datos para verificación posterior
  this.ultimoContacto = datos;
});

When('el usuario hace clic en el botón {string}', async function (textoBoton) {
  if (textoBoton === 'Submit') {
    await this.page.click('#submit');
  } else if (textoBoton === 'Cancel') {
    await this.page.click('#cancel');
  } else {
    // Fallback por texto
    await this.page.click(`button:has-text("${textoBoton}")`);
  }
  
  await this.page.waitForLoadState('networkidle');
  console.log(`✓ Hizo clic en botón: ${textoBoton}`);
});

Then('debería ver el contacto {string} en la lista', async function (nombreCompleto) {
  // Esperar a volver a la lista
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  
  // Esperar a que aparezca el nombre en la tabla
  const contacto = this.page.locator(`tr.contactTableBodyRow:has-text("${nombreCompleto}")`);
  await expect(contacto).toBeVisible({ timeout: 5000 });
  
  console.log(`✓ Contacto "${nombreCompleto}" visible en la lista`);
});

Then('debería poder ver los detalles del contacto', async function () {
  // Hacer clic en el contacto recién creado (en la fila de la tabla)
  const nombreCompleto = `${this.ultimoContacto.firstName} ${this.ultimoContacto.lastName}`;
  const fila = this.page.locator(`tr.contactTableBodyRow:has-text("${nombreCompleto}")`);
  await fila.click();
  
  // Esperar a que navegue a detalles
  await this.page.waitForURL('**/contactDetails**', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  // Verificar que estamos en la página de detalles
  const url = this.page.url();
  expect(url).toContain('contactDetails');
  
  console.log('✓ Está en la página de detalles del contacto');
});

// ============================================
// EDITAR CONTACTO
// ============================================

Given('que existe un contacto llamado {string}', async function (nombreCompleto) {
  // Hacer clic en Add a New Contact
  await this.page.click('#add-contact');
  await this.page.waitForLoadState('networkidle');
  
  // Separar nombre y apellido
  const [firstName, lastName] = nombreCompleto.split(' ');
  
  // Llenar formulario
  await this.page.fill('#firstName', firstName);
  await this.page.fill('#lastName', lastName);
  await this.page.fill('#email', `${firstName.toLowerCase()}@email.com`);
  await this.page.fill('#phone', '3001234567');
  
  // Guardar datos del contacto
  this.contactoCreado = { firstName, lastName };
  
  // Enviar formulario
  await this.page.click('#submit');
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log(`✓ Contacto "${nombreCompleto}" creado`);
});

When('el usuario hace clic en el contacto {string}', async function (nombreCompleto) {
  // Hacer clic en la fila de la tabla que contiene ese contacto
  const fila = this.page.locator(`tr.contactTableBodyRow:has-text("${nombreCompleto}")`);
  await fila.click();
  
  // Esperar a que navegue a detalles
  await this.page.waitForURL('**/contactDetails**', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  console.log(`✓ Hizo clic en contacto: ${nombreCompleto}`);
});

When('el usuario modifica el teléfono a {string}', async function (nuevoTelefono) {
  // Limpiar el campo y escribir el nuevo teléfono
  await this.page.fill('#phone', '');
  await this.page.fill('#phone', nuevoTelefono);
  this.telefonoModificado = nuevoTelefono;
  
  console.log(`✓ Modificó teléfono a: ${nuevoTelefono}`);
});

Then('debería ver el contacto actualizado con teléfono {string}', async function (telefono) {
  // Esperar a volver a detalles
  await this.page.waitForURL('**/contactDetails**', { timeout: 10000 });
  
  // Verificar que el teléfono se actualizó en la página
  const telefonoElement = this.page.locator(`text=${telefono}`);
  await expect(telefonoElement).toBeVisible({ timeout: 5000 });
  
  console.log(`✓ Teléfono actualizado correctamente: ${telefono}`);
});

// ============================================
// ELIMINAR CONTACTO
// ============================================

Then('no debería ver el contacto {string} en la lista', async function (nombreCompleto) {
  // Esperar a volver a la lista
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
  
  // Esperar un momento para que la tabla se actualice
  await this.page.waitForTimeout(1000);
  
  // Verificar que el contacto NO está visible en la tabla
  const fila = this.page.locator(`tr.contactTableBodyRow:has-text("${nombreCompleto}")`);
  await expect(fila).not.toBeVisible({ timeout: 5000 });
  
  console.log(`✓ Contacto "${nombreCompleto}" eliminado correctamente`);
});

// ============================================
// VALIDACIONES
// ============================================

When('el usuario llena solo el apellido {string}', async function (apellido) {
  await this.page.fill('#lastName', apellido);
  console.log(`✓ Llenó solo el apellido: ${apellido}`);
});

Then('debería ver un mensaje de error', async function () {
  // Esperar un poco para que aparezca el error
  await this.page.waitForTimeout(1000);
  
  // Buscar mensajes de error comunes
  const errorSelectors = [
    '#error',
    '.error',
    '[class*="error"]',
    'text=required',
    'text=Required',
    'text=error',
    'text=Error'
  ];
  
  let errorFound = false;
  let errorText = '';
  
  for (const selector of errorSelectors) {
    try {
      const errorElement = this.page.locator(selector).first();
      if (await errorElement.isVisible({ timeout: 2000 })) {
        errorFound = true;
        errorText = await errorElement.textContent();
        console.log(`✓ Mensaje de error encontrado: ${errorText}`);
        break;
      }
    } catch (e) {
      // Continuar con siguiente selector
    }
  }
  
  // Si no encontró error visible, verificar que no navegó
  if (!errorFound) {
    const url = this.page.url();
    errorFound = url.includes('addContact');
    if (errorFound) {
      console.log('✓ Se quedó en la página de agregar contacto (indica error de validación)');
    }
  }
  
  expect(errorFound).toBe(true);
});

Then('el contacto no debería ser creado', async function () {
  // Verificar que seguimos en la página de agregar contacto
  const url = this.page.url();
  expect(url).toContain('addContact');
  
  console.log('✓ El contacto no fue creado (seguimos en addContact)');
});