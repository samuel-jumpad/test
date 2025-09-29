import LoginPage from '../../support/pages/login/login.page.js';

describe('Login-related tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    // Wait for page to be ready before each test
    cy.wait(1000);
  });

  it('should login with valid credentials successfully', () => {
    LoginPage
      .visit()
      .performValidLogin()
      .waitForPageLoad();
    
    // Additional wait after successful login
    cy.wait(2000);
  });

  it('should fail login with wrong email', () => {
    LoginPage
      .visit()
      .performWrongEmailLogin()
      .waitForPageLoad();
    
    // Wait for error message to appear
    cy.wait(1500);
  });

  it('should fail login with wrong password', () => {
    LoginPage
      .visit()
      .performWrongPasswordLogin()
      .waitForPageLoad();
    
    // Wait for error message to appear
    cy.wait(1500);
  });

  it('should fail login with wrong credentials', () => {
    LoginPage
      .visit()
      .performWrongCredentialsLogin()
      .waitForPageLoad();
    
    // Wait for error message to appear
    cy.wait(1500);
  });

});