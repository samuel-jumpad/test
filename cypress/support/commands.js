import LoginPage from './pages/login/login.page.js';

Cypress.Commands.add('setupTest', () => {
  cy.viewport(1440, 900);
  cy.login();
});

Cypress.Commands.add('login', () => {
  LoginPage.visit();
  LoginPage.loginWithValidCredentials();
  LoginPage.validateLoginSuccess();
});

Cypress.Commands.add('sendChatMessage', (message) => {
  cy.get('div[role="textbox"][contenteditable="true"][data-placeholder="Digite aqui sua mensagem..."]')
    .should('be.visible', { timeout: 10000 })
    .scrollIntoView()
    .type(message, { delay: 100 });
  
  cy.get('button[type="submit"]')
    .click();
});

Cypress.Commands.add('validateMessageSent', () => {
  cy.get('.p-2.border.rounded-xl.bg-gray-100')
    .should('be.visible');
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.wait(1000);
});

Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView();
});

Cypress.Commands.add('clickElement', (selector) => {
  cy.get(selector).should('be.visible').click();
});

Cypress.Commands.add('loginWithValidCredentials', () => {
  LoginPage
    .visit()
    .loginWithValidCredentials()
    .validateLoginSuccess();
});

Cypress.Commands.add('loginWithInvalidCredentials', () => {
  LoginPage
    .visit()
    .loginWithInvalidCredentials()
    .validateLoginFailure();
});

Cypress.Commands.add('logout', () => {
  cy.get('svg.lucide-chevron-down')
    .should('be.visible')
    .click();

  cy.wait(500);

  cy.get('span').contains('Sair')
    .should('be.visible')
    .click();

  cy.url().should('include', '/');
  cy.get('h6').contains('Entrar no Workspace').should('be.visible');
});