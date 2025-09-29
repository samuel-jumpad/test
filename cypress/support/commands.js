import LoginPage from './pages/login/login.page.js';

// Setup interceptors for common API calls
Cypress.Commands.add('setupInterceptors', () => {
  // Intercept login request
  cy.intercept('POST', '**/auth/login', { fixture: 'login-response.json' }).as('loginRequest');
  
  // Intercept agent creation request
  cy.intercept('POST', '**/assistants', { fixture: 'agent-creation-response.json' }).as('createAgentRequest');
  
  // Intercept agent deletion request
  cy.intercept('DELETE', '**/assistants/**', { fixture: 'agent-deletion-response.json' }).as('deleteAgentRequest');
  
  // Intercept chat message request
  cy.intercept('POST', '**/chat/**', { fixture: 'chat-response.json' }).as('chatMessageRequest');
  
  // Intercept page load requests
  cy.intercept('GET', '**/dashboard**').as('dashboardLoad');
  cy.intercept('GET', '**/assistants**').as('agentsLoad');
});

Cypress.Commands.add('setupTest', () => {
  cy.viewport(1440, 900);
  cy.setupInterceptors();
  cy.login();
});

Cypress.Commands.add('login', () => {
  LoginPage.visit();
  
  // Wait for login form to be ready
  cy.get('input[name="email"]').should('be.visible').and('be.enabled');
  cy.get('input[name="password"]').should('be.visible').and('be.enabled');
  cy.get('button[type="submit"]').should('be.visible').and('be.enabled');
  
  LoginPage.loginWithValidCredentials();
  
  // Wait for login request to complete
  cy.wait('@loginRequest', { timeout: 15000 });
  
  // Wait for dashboard to load
  cy.wait('@dashboardLoad', { timeout: 15000 });
  
  LoginPage.validateLoginSuccess();
});

Cypress.Commands.add('sendChatMessage', (message) => {
  // Wait for message input to be ready
  cy.get('div[role="textbox"][contenteditable="true"][data-placeholder="Digite aqui sua mensagem..."]')
    .should('be.visible', { timeout: 15000 })
    .and('be.enabled')
    .scrollIntoView()
    .clear()
    .type(message, { delay: 100 })
    .should('contain.text', message);
  
  // Click send button
  cy.get('button[type="submit"]')
    .should('be.visible')
    .and('be.enabled')
    .click();
  
  // Wait for message to be sent
  cy.wait('@chatMessageRequest', { timeout: 15000 });
  
  // Wait for response to be processed
  cy.get('body').should('not.contain', 'loading');
});

Cypress.Commands.add('validateMessageSent', () => {
  // Wait for message bubble to appear
  cy.get('.p-2.border.rounded-xl.bg-gray-100', { timeout: 15000 })
    .should('be.visible');
  
  // Ensure chat is not in loading state
  cy.get('body').should('not.contain', 'loading');
});

Cypress.Commands.add('waitForPageLoad', () => {
  // Wait for page to be fully interactive
  cy.get('body').should('be.visible');
  cy.get('body').should('not.contain', 'loading');
  cy.document().should('have.property', 'readyState', 'complete');
  
  // Additional wait for any pending animations or transitions
  cy.get('[data-testid="loading"], .loading, [class*="loading"]').should('not.exist');
});

Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector)
    .should('exist')
    .scrollIntoView()
    .should('be.visible');
});

Cypress.Commands.add('clickElement', (selector) => {
  cy.get(selector)
    .should('be.visible')
    .and('be.enabled')
    .click();
  
  // Wait for click action to complete
  cy.get('body').should('not.contain', 'loading');
});

Cypress.Commands.add('loginWithValidCredentials', () => {
  // Setup interceptors for login flow
  cy.setupInterceptors();
  
  LoginPage
    .visit()
    .loginWithValidCredentials();
  
  // Wait for login request to complete
  cy.wait('@loginRequest', { timeout: 15000 });
  cy.wait('@dashboardLoad', { timeout: 15000 });
  
  LoginPage.validateLoginSuccess();
});

Cypress.Commands.add('loginWithInvalidCredentials', () => {
  // Setup interceptors for login flow
  cy.setupInterceptors();
  
  LoginPage
    .visit()
    .loginWithInvalidCredentials();
  
  // Wait for login error response
  cy.wait('@loginRequest', { timeout: 15000 });
  
  LoginPage.validateLoginFailure();
});

Cypress.Commands.add('logout', () => {
  // Click on user menu
  cy.get('svg.lucide-chevron-down')
    .should('be.visible')
    .and('be.enabled')
    .click();

  // Wait for dropdown to appear
  cy.get('body').should('not.contain', 'loading');

  // Click logout option
  cy.get('span').contains('Sair')
    .should('be.visible')
    .and('be.enabled')
    .click();

  // Wait for logout to complete
  cy.url({ timeout: 15000 }).should('include', '/');
  cy.get('h6').contains('Entrar no Workspace', { timeout: 15000 }).should('be.visible');
  
  // Verify we're back on login page
  cy.get('input[name="email"]').should('be.visible');
  cy.get('input[name="password"]').should('be.visible');
});