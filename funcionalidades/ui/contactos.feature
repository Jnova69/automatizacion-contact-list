# funcionalidades/contactos.feature

@ui
Feature: Gestión de contactos
  Como usuario autenticado
  Quiero poder gestionar mis contactos
  Para mantener mi lista de contactos organizada

  Background:
    # Registrarse y hacer login antes de cada escenario
    Given que el usuario está registrado y autenticado

  @smoke @crud
  Scenario: Crear un contacto nuevo con todos los datos
    When el usuario hace clic en "Add a New Contact"
    And el usuario llena el formulario de contacto con:
      | firstName  | Juan           |
      | lastName   | Pérez          |
      | birthdate  | 1990-01-15     |
      | email      | juan@email.com |
      | phone      | 3001234567     |
      | street1    | Calle 123      |
      | street2    | Apto 4B        |
      | city       | Bogotá         |
      | stateProvince | Cundinamarca |
      | postalCode | 110111         |
      | country    | Colombia       |
    And el usuario hace clic en el botón "Submit"
    Then debería ver el contacto "Juan Pérez" en la lista
    And debería poder ver los detalles del contacto

  @crud
  Scenario: Editar un contacto existente
    Given que existe un contacto llamado "María López"
    When el usuario hace clic en el contacto "María López"
    And el usuario hace clic en "Edit Contact"
    And el usuario modifica el teléfono a "3109876543"
    And el usuario hace clic en el botón "Submit"
    Then debería ver el contacto actualizado con teléfono "3109876543"

  @crud
  Scenario: Eliminar un contacto
    Given que existe un contacto llamado "Pedro Gómez"
    When el usuario hace clic en el contacto "Pedro Gómez"
    And el usuario hace clic en "Delete Contact"
    Then no debería ver el contacto "Pedro Gómez" en la lista

  @validacion
  Scenario: Intentar crear contacto sin nombre
    When el usuario hace clic en "Add a New Contact"
    And el usuario llena solo el apellido "Smith"
    And el usuario hace clic en el botón "Submit"
    Then debería ver un mensaje de error
    And el contacto no debería ser creado