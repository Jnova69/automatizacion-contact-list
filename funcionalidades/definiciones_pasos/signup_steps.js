const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('que el usuario está en la página de registro', async function () {
  await this.loginPage.navigate();
  await this.loginPage.goToSignup();
  console.log('Navegó a la página de registro');
});

When('el usuario ingresa nombre {string}', async function (nombre) {
  await this.signupPage.enterFirstName(nombre);
  console.log(`Ingresó nombre: ${nombre}`);
});

When('el usuario ingresa apellido {string}', async function (apellido) {
  await this.signupPage.enterLastName(apellido);
  console.log(`Ingresó apellido: ${apellido}`);
});

When('el usuario ingresa email de registro {string}', async function (email) {
  const timestamp = Date.now();
  const emailFinal = email.replace('{{timestamp}}', timestamp);
  this.emailRegistrado = emailFinal;
  await this.signupPage.enterEmail(emailFinal);
  console.log(`Ingresó email: ${emailFinal}`);
});

When('el usuario ingresa contraseña de registro {string}', async function (password) {
  this.passwordRegistrado = password;
  await this.signupPage.enterPassword(password);
  console.log('Ingresó contraseña');
});

When('el usuario hace clic en el botón de registro', async function () {
  await this.signupPage.clickSubmit();
  await this.page.waitForTimeout(3000);

  const currentUrl = this.signupPage.getCurrentUrl();
  console.log('Hizo clic en Submit');
  console.log('URL actual:', currentUrl);

  try {
    const errorElement = this.page.locator('#error, .error, [class*="error"]').first();
    if (await errorElement.isVisible({ timeout: 2000 })) {
      const errorText = await errorElement.textContent();
      console.log('Error encontrado:', errorText);
    }
  } catch (e) {
  }
});

Then('debería ver un mensaje de bienvenida', async function () {
  try {
    await this.page.waitForURL('**/contactList', { timeout: 15000 });
  } catch (error) {
    const currentUrl = this.page.url();
    console.log('No redirigió a contactList. URL actual:', currentUrl);

    const bodyText = await this.page.textContent('body');
    console.log('Contenido de la página:', bodyText.substring(0, 500));

    throw new Error(`Registro falló. URL actual: ${currentUrl}`);
  }

  const isOnContactList = await this.contactListPage.isOnContactListPage();
  expect(isOnContactList).toBe(true);
  console.log('Registro exitoso - está en contactList');
});
