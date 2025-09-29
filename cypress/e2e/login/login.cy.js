import LoginPage from '../../support/pages/login/login.page.js';

describe('Login-related tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    // Wait for page to be ready before each test
    cy.wait(1000);
  });

  it('should login with valid credentials successfully', () => {
    // Setup interceptors specifically for success test
    cy.setupInterceptors();
    
    LoginPage
      .visit()
      .performValidLogin()
      .waitForPageLoad();
    
    // Additional wait after successful login
    cy.wait(2000);
  });

  it('should fail login with wrong email', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    LoginPage
      .visit()
      .performWrongEmailLogin();
    
    // Assert error message appears
    cy.get('body').should('contain', 'O e-mail ou a senha estão incorretos. Por favor, verifique suas credenciais.');
    
    // Wait for error message to appear
    cy.wait(1500);
  });

  it('should fail login with wrong password', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    LoginPage
      .visit()
      .performWrongPasswordLogin();
    
    // Assert error message appears
    cy.get('body').should('contain', 'O e-mail ou a senha estão incorretos. Por favor, verifique suas credenciais.');
    
    // Wait for error message to appear
    cy.wait(1500);
  });

  it('should fail login with wrong credentials', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    LoginPage
      .visit()
      .performWrongCredentialsLogin();
    
    // Assert error message appears
    cy.get('body').should('contain', 'O e-mail ou a senha estão incorretos. Por favor, verifique suas credenciais.');
    
    // Wait for error message to appear
    cy.wait(1500);
  });

});