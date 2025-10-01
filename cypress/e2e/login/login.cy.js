import { LoginPage } from '../../support/pages/login/login.page.js';

describe('Login-related tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    // Wait for page to be ready before each test
    cy.wait(1000);
  });

  it('should login with valid credentials successfully', () => {
    // Setup interceptors specifically for success test
    cy.setupInterceptors();
    
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('teste@email.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton()
      .waitForDashboard()
      .waitForPageLoad();
    
    // Additional wait after successful login
    cy.wait(2000);
  });

  it('should fail login with wrong email', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('emailerrado@teste.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton();
    
    // Verify login failed by checking we're still on login page
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    
    // Verify form elements are still visible (login didn't succeed)
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    
    cy.log('✅ Login falhou conforme esperado');
  });

  it('should fail login with wrong password', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('teste@email.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
    
    // Verify login failed by checking we're still on login page
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    
    // Verify form elements are still visible (login didn't succeed)
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    
    cy.log('✅ Login falhou conforme esperado');
  });

  it('should fail login with wrong credentials', () => {
    // Setup interceptors specifically for failure test
    cy.setupInterceptorsForFailure();
    
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('emailerrado@teste.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
    
    // Verify login failed by checking we're still on login page
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    
    // Verify form elements are still visible (login didn't succeed)
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    
    cy.log('✅ Login falhou conforme esperado');
  });

});