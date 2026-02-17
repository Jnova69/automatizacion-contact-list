const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const API_BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

When('creo un usuario via API con:', async function (dataTable) {
  const datos = dataTable.rowsHash();
  const timestamp = Date.now();
  const email = datos.email.replace('{{timestamp}}', timestamp);
  
  const payload = {
    firstName: datos.firstName,
    lastName: datos.lastName,
    email: email,
    password: datos.password
  };
  
  this.apiUser = payload;
  
  const response = await this.page.request.post(`${API_BASE_URL}/users`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Usuario creado via API: ${email}`);
  console.log(`Status: ${response.status()}`);
});

Given('que existe un usuario registrado via API', async function () {
  const timestamp = Date.now();
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_${timestamp}@example.com`,
    password: 'Password123'
  };
  
  const response = await this.page.request.post(`${API_BASE_URL}/users`, {
    data: payload
  });
  
  this.apiUser = payload;
  const body = await response.json();
  this.apiToken = body.token;
  
  console.log(`Usuario registrado: ${payload.email}`);
});

When('hago login via API con las credenciales del usuario', async function () {
  const payload = {
    email: this.apiUser.email,
    password: this.apiUser.password
  };
  
  const response = await this.page.request.post(`${API_BASE_URL}/users/login`, {
    data: payload
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Login realizado: ${response.status()}`);
});

When('hago login via API con credenciales inválidas', async function () {
  const payload = {
    email: 'noexiste@example.com',
    password: 'WrongPassword'
  };
  
  const response = await this.page.request.post(`${API_BASE_URL}/users/login`, {
    data: payload
  });
  
  this.apiResponse = response;
  
  try {
    this.apiResponseBody = await response.json();
  } catch (e) {
    this.apiResponseBody = {};
  }
  
  console.log(`Login con credenciales inválidas: ${response.status()}`);
});

Given('que existe un usuario autenticado via API', async function () {
  const timestamp = Date.now();
  const payload = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_${timestamp}@example.com`,
    password: 'Password123'
  };
  
  const response = await this.page.request.post(`${API_BASE_URL}/users`, {
    data: payload
  });
  
  const body = await response.json();
  
  this.apiUser = payload;
  this.apiToken = body.token;
  this.apiUserId = body.user._id;
  
  console.log('Usuario autenticado con token');
});

When('obtengo el perfil del usuario via API', async function () {
  const response = await this.page.request.get(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${this.apiToken}`
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Perfil obtenido: ${response.status()}`);
});

When('actualizo el nombre del usuario a {string}', async function (nuevoNombre) {
  const response = await this.page.request.patch(`${API_BASE_URL}/users/me`, {
    data: {
      firstName: nuevoNombre
    },
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  this.nombreActualizado = nuevoNombre;
  
  console.log(`Usuario actualizado: ${response.status()}`);
});

When('elimino el usuario via API', async function () {
  const response = await this.page.request.delete(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${this.apiToken}`
    }
  });
  
  this.apiResponse = response;
  
  console.log(`Usuario eliminado: ${response.status()}`);
});

When('creo un contacto via API con:', async function (dataTable) {
  const datos = dataTable.rowsHash();
  
  const response = await this.page.request.post(`${API_BASE_URL}/contacts`, {
    data: datos,
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  if (response.ok()) {
    this.apiContactId = this.apiResponseBody._id;
  }
  
  console.log(`Contacto creado: ${response.status()}`);
});

When('creo un contacto via API sin firstName', async function () {
  const datos = {
    lastName: 'Test',
    email: 'test@example.com'
  };
  
  const response = await this.page.request.post(`${API_BASE_URL}/contacts`, {
    data: datos,
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Intento crear contacto sin firstName: ${response.status()}`);
});

Given('que existen contactos creados via API', async function () {
  for (let i = 1; i <= 2; i++) {
    await this.page.request.post(`${API_BASE_URL}/contacts`, {
      data: {
        firstName: `Contacto${i}`,
        lastName: 'Test',
        email: `contacto${i}@example.com`
      },
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  console.log('Contactos de prueba creados');
});

When('obtengo la lista de contactos via API', async function () {
  const response = await this.page.request.get(`${API_BASE_URL}/contacts`, {
    headers: {
      'Authorization': `Bearer ${this.apiToken}`
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Lista obtenida: ${response.status()}`);
});

Given('que existe un contacto creado via API', async function () {
  const response = await this.page.request.post(`${API_BASE_URL}/contacts`, {
    data: {
      firstName: 'Test',
      lastName: 'Contact',
      email: 'testcontact@example.com',
      phone: '3001234567'
    },
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const body = await response.json();
  this.apiContactId = body._id;
  
  console.log(`Contacto creado con ID: ${this.apiContactId}`);
});

When('obtengo el contacto via API', async function () {
  const response = await this.page.request.get(`${API_BASE_URL}/contacts/${this.apiContactId}`, {
    headers: {
      'Authorization': `Bearer ${this.apiToken}`
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  
  console.log(`Contacto obtenido: ${response.status()}`);
});

When('actualizo el teléfono del contacto a {string}', async function (nuevoTelefono) {
  const response = await this.page.request.patch(`${API_BASE_URL}/contacts/${this.apiContactId}`, {
    data: {
      phone: nuevoTelefono
    },
    headers: {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  this.apiResponse = response;
  this.apiResponseBody = await response.json();
  this.telefonoActualizado = nuevoTelefono;
  
  console.log(`Contacto actualizado: ${response.status()}`);
});

When('elimino el contacto via API', async function () {
  const response = await this.page.request.delete(`${API_BASE_URL}/contacts/${this.apiContactId}`, {
    headers: {
      'Authorization': `Bearer ${this.apiToken}`
    }
  });
  
  this.apiResponse = response;
  
  console.log(`Contacto eliminado: ${response.status()}`);
});

Then('la respuesta debe tener status code {int}', async function (statusCode) {
  expect(this.apiResponse.status()).toBe(statusCode);
  console.log(`Status code: ${statusCode}`);
});

Then('la respuesta debe contener un token', async function () {
  expect(this.apiResponseBody).toHaveProperty('token');
  expect(this.apiResponseBody.token).toBeTruthy();
  this.apiToken = this.apiResponseBody.token;
  console.log('Token presente en la respuesta');
});

Then('la respuesta debe contener el email del usuario', async function () {
  expect(this.apiResponseBody).toHaveProperty('user');
  expect(this.apiResponseBody.user.email).toBe(this.apiUser.email);
  console.log('Email del usuario correcto');
});

Then('el token debe ser válido', async function () {
  expect(this.apiToken).toBeTruthy();
  expect(this.apiToken.length).toBeGreaterThan(20);
  console.log('Token válido');
});

Then('la respuesta debe contener un mensaje de error', async function () {
  expect(this.apiResponseBody).toHaveProperty('message');
  console.log(`Mensaje de error: ${this.apiResponseBody.message}`);
});

Then('la respuesta debe contener los datos del usuario', async function () {
  expect(this.apiResponseBody).toHaveProperty('firstName');
  expect(this.apiResponseBody).toHaveProperty('lastName');
  expect(this.apiResponseBody).toHaveProperty('email');
  console.log('Datos del usuario presentes');
});

Then('el nombre del usuario debe ser {string}', async function (nombre) {
  expect(this.apiResponseBody.firstName).toBe(nombre);
  console.log(`Nombre actualizado a: ${nombre}`);
});

Then('la respuesta debe contener el contacto creado', async function () {
  expect(this.apiResponseBody).toHaveProperty('_id');
  expect(this.apiResponseBody).toHaveProperty('firstName');
  expect(this.apiResponseBody).toHaveProperty('lastName');
  console.log('Contacto creado correctamente');
});

Then('la respuesta debe contener un array de contactos', async function () {
  expect(Array.isArray(this.apiResponseBody)).toBe(true);
  expect(this.apiResponseBody.length).toBeGreaterThan(0);
  console.log(`Array con ${this.apiResponseBody.length} contactos`);
});

Then('la respuesta debe contener los datos del contacto', async function () {
  expect(this.apiResponseBody).toHaveProperty('_id');
  expect(this.apiResponseBody._id).toBe(this.apiContactId);
  console.log('Datos del contacto correctos');
});

Then('el teléfono del contacto debe ser {string}', async function (telefono) {
  expect(this.apiResponseBody.phone).toBe(telefono);
  console.log(`Teléfono actualizado a: ${telefono}`);
});

Then('la respuesta debe contener un mensaje de error de validación', async function () {
  expect(this.apiResponseBody).toHaveProperty('message');
  expect(this.apiResponseBody.message).toContain('validation');
  console.log(`Error de validación: ${this.apiResponseBody.message}`);
});