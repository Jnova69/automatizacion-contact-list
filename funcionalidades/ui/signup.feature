@ui
Feature: Registro de usuarios
  Como nuevo usuario
  Quiero poder registrarme
  Para usar la aplicación

  Background:
    Given que el usuario está en la página de registro

  @smoke
  Scenario: Registro exitoso con datos válidos
    When el usuario ingresa nombre "Test"
    And el usuario ingresa apellido "User"
    And el usuario ingresa email de registro "test_{{timestamp}}@example.com"
    And el usuario ingresa contraseña de registro "Password123"
    And el usuario hace clic en el botón de registro
    Then debería ver la página de contactos
    And debería ver un mensaje de bienvenida