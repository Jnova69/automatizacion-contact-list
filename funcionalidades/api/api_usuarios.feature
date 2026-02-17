@api
Feature: API - Gestión de usuarios
  Como desarrollador
  Quiero probar los endpoints de usuarios
  Para verificar que la API funciona correctamente

  @smoke
  Scenario: Registrar un nuevo usuario via API
    When creo un usuario via API con:
      | firstName | Test           |
      | lastName  | API            |
      | email     | api_{{timestamp}}@example.com |
      | password  | Password123    |
    Then la respuesta debe tener status code 201
    And la respuesta debe contener un token
    And la respuesta debe contener el email del usuario

  @smoke
  Scenario: Login exitoso via API
    Given que existe un usuario registrado via API
    When hago login via API con las credenciales del usuario
    Then la respuesta debe tener status code 200
    And la respuesta debe contener un token
    And el token debe ser válido

  Scenario: Login con credenciales incorrectas
    When hago login via API con credenciales inválidas
    Then la respuesta debe tener status code 401
    And la respuesta debe contener un mensaje de error

  Scenario: Obtener perfil de usuario autenticado
    Given que existe un usuario autenticado via API
    When obtengo el perfil del usuario via API
    Then la respuesta debe tener status code 200
    And la respuesta debe contener los datos del usuario

  Scenario: Actualizar perfil de usuario
    Given que existe un usuario autenticado via API
    When actualizo el nombre del usuario a "Updated Name"
    Then la respuesta debe tener status code 200
    And el nombre del usuario debe ser "Updated Name"

  Scenario: Eliminar usuario
    Given que existe un usuario autenticado via API
    When elimino el usuario via API
    Then la respuesta debe tener status code 200