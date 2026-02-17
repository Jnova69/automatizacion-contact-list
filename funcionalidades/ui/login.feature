@ui
Feature: Login de usuarios
  Como usuario de la aplicación
  Quiero poder iniciar sesión
  Para acceder a mi lista de contactos

  @smoke @e2e
  Scenario: Flujo completo - Registro, Logout y Login
    # Registro
    Given que el usuario está en la página de registro
    When el usuario ingresa nombre "Test"
    And el usuario ingresa apellido "User"
    And el usuario ingresa email de registro "test_{{timestamp}}@example.com"
    And el usuario ingresa contraseña de registro "Password123"
    And el usuario hace clic en el botón de registro
    Then debería ver la página de contactos
    
    # Logout
    When el usuario hace logout
    
    # Login
    Given que el usuario está en la página de login
    When el usuario ingresa el email registrado
    And el usuario ingresa la contraseña registrada
    And el usuario hace clic en el botón Submit
    Then debería ver la página de contactos
    And debería ver el botón "Add a New Contact"