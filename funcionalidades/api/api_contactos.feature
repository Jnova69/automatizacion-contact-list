@api
Feature: API - Gestión de contactos
  Como desarrollador
  Quiero probar los endpoints de contactos
  Para verificar que la API funciona correctamente

  Background:
    Given que existe un usuario autenticado via API

  @smoke
  Scenario: Crear un contacto via API
    When creo un contacto via API con:
      | firstName     | Carlos        |
      | lastName      | Rodríguez     |
      | birthdate     | 1985-05-20    |
      | email         | carlos@email.com |
      | phone         | 3001234567    |
      | street1       | Calle 50      |
      | city          | Medellín      |
      | stateProvince | Antioquia     |
      | postalCode    | 050001        |
      | country       | Colombia      |
    Then la respuesta debe tener status code 201
    And la respuesta debe contener el contacto creado

  @smoke
  Scenario: Obtener lista de contactos via API
    Given que existen contactos creados via API
    When obtengo la lista de contactos via API
    Then la respuesta debe tener status code 200
    And la respuesta debe contener un array de contactos

  Scenario: Obtener un contacto específico via API
    Given que existe un contacto creado via API
    When obtengo el contacto via API
    Then la respuesta debe tener status code 200
    And la respuesta debe contener los datos del contacto

  Scenario: Actualizar un contacto via API
    Given que existe un contacto creado via API
    When actualizo el teléfono del contacto a "3109999999"
    Then la respuesta debe tener status code 200
    And el teléfono del contacto debe ser "3109999999"

  Scenario: Eliminar un contacto via API
    Given que existe un contacto creado via API
    When elimino el contacto via API
    Then la respuesta debe tener status code 200

  Scenario: Intentar crear contacto sin firstName
    When creo un contacto via API sin firstName
    Then la respuesta debe tener status code 400
    And la respuesta debe contener un mensaje de error de validación