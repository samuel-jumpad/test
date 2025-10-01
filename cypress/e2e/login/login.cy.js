import { LoginPage } from '../../support/pages/login/login.page.js';

describe('Login-related tests', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.wait(1000);
  });

  it('should login with valid credentials successfully', () => {
    cy.setupInterceptors();
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('teste@email.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton()
      .waitForDashboard()
      .waitForPageLoad();
    cy.wait(2000);
  });

  it('should fail login with wrong email', () => {
    cy.setupInterceptorsForFailure();
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('emailerrado@teste.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton();
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.log('✅ Login falhou conforme esperado');
  });

  it('should fail login with wrong password', () => {
    cy.setupInterceptorsForFailure();
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('teste@email.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.log('✅ Login falhou conforme esperado');
  });

  it('should fail login with wrong credentials', () => {
    cy.setupInterceptorsForFailure();
    const loginPage = new LoginPage();
    loginPage
      .visit()
      .fillEmail('emailerrado@teste.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.log('✅ Login falhou conforme esperado');
  });
});