import { LoginPage } from './pages/login/login.page.js';
import 'cypress-real-events/support';
import '@4tw/cypress-drag-drop';


Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('m.target?.contains is not a function') ||
      err.message.includes('contains is not a function') ||
      err.message.includes('Cannot read properties of undefined') ||
      err.message.includes('parentElement')) {
    console.log('⚠️ Ignorando erro de aplicação:', err.message);
    return false;
  }
  return true;
});

// Comando customizado para scrollIntoView seguro
Cypress.Commands.add('safeScrollIntoView', { prevSubject: 'element' }, (subject, options = {}) => {
  cy.wrap(subject).then(($el) => {
    if ($el && $el.length > 0 && $el[0] && $el[0].isConnected) {
      try {
        cy.wrap($el).scrollIntoView(options);
      } catch (error) {
        cy.log('⚠️ Erro ao fazer scroll, mas continuando...');
      }
    } else {
      cy.log('⚠️ Elemento não está conectado ao DOM, pulando scrollIntoView');
    }
  });
  return cy.wrap(subject);
});

Cypress.Commands.add('setupInterceptorsForFailure', () => {
  cy.intercept('POST', '**/auth/login', (req) => {
    const body = req.body;
    console.log('Login attempt with:', { email: body.email, password: body.password });
    console.log('Failure test - always returning error');
    req.reply({ 
      statusCode: 401, 
      body: { 
        error: 'Invalid credentials',
        message: 'O e-mail ou a senha estão incorretos. Por favor, verifique suas credenciais.'
      } 
    });
  }).as('loginRequest');
  cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('translationRequest');
  cy.intercept('GET', '**/translate.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('googleTranslationRequest');
});

Cypress.Commands.add('setupInterceptors', () => {
  cy.intercept('POST', '**/auth/login', (req) => {
    const body = req.body;
    console.log('Login attempt with:', { email: body.email, password: body.password });
    if (body.email === 'teste@email.com' && body.password === 'Jumpad@2025') {
      console.log('Valid credentials - returning success');
      req.reply({ 
        statusCode: 200,
        body: {
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '123',
            email: 'teste@email.com',
            name: 'Test User'
          },
          redirect: '/dashboard'
        }
      });
    } else {
      console.log('Invalid credentials - returning error');
      req.reply({ 
        statusCode: 401, 
        body: { 
          error: 'Invalid credentials',
          message: 'O e-mail ou a senha estão incorretos. Por favor, verifique suas credenciais.'
        } 
      });
    }
  }).as('loginRequest');
  cy.intercept('POST', '**/assistants', { fixture: 'agent-creation-response.json' }).as('createAgentRequest');
  cy.intercept('DELETE', '**/assistants/**', { fixture: 'agent-deletion-response.json' }).as('deleteAgentRequest');
  cy.intercept('POST', '**/chats/**/messages', { fixture: 'chat-response.json' }).as('chatMessageRequest');
  cy.intercept('POST', '**/api/token', (req) => {
    req.reply({ 
      statusCode: 200, 
      body: { 
        success: true, 
        token: 'mock-jwt-token',
        message: 'Token generated successfully' 
      } 
    });
  }).as('tokenRequest');
  cy.intercept('GET', '**/api/users/me', (req) => {
    req.reply({ 
      statusCode: 200, 
      body: { 
        id: '123',
        email: 'teste@email.com',
        name: 'Test User',
        profile: 'active'
      } 
    });
  }).as('userProfileRequest');
  cy.intercept('GET', '**/api/llms', { 
    statusCode: 200, 
    body: { llms: [] } 
  }).as('llmsRequest');
  cy.intercept('GET', '**/api/agents/featured', { 
    statusCode: 200, 
    body: { agents: [] } 
  }).as('featuredAgentsRequest');
  cy.intercept('GET', '**/api/agents/most-used', { 
    statusCode: 200, 
    body: { agents: [] } 
  }).as('mostUsedAgentsRequest');
  cy.intercept('GET', '**/api/chats/folders**', { 
    statusCode: 200, 
    body: { folders: [] } 
  }).as('chatsFoldersRequest');
  cy.intercept('GET', '**/api/agents?chat_with_me=true**', { 
    statusCode: 200, 
    body: { agents: [] } 
  }).as('chatAgentsRequest');
  cy.intercept('GET', '**/api/mcp/internal**', { 
    statusCode: 200, 
    body: { mcp: [] } 
  }).as('mcpRequest');
  cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('translationRequest');
  cy.intercept('GET', '**/translate.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('googleTranslationRequest');
});

Cypress.Commands.add('setupTest', () => {
  cy.viewport(1440, 900);
  cy.wait(1000);
  const loginPage = new LoginPage();
  loginPage.visit();
  cy.wait(2000);
  loginPage
    .fillEmail('teste@email.com')
    .fillPassword('Jumpad@2025')
    .clickLoginButton()
    .waitForDashboard();
  cy.url({ timeout: 45000 }).should('include', '/dashboard');
  cy.get('body').should('not.contain', 'loading');
  cy.wait(3000);
});

Cypress.Commands.add('loginWithValidCredentials', () => {
  cy.setupInterceptors();
  const loginPage = new LoginPage();
  loginPage
    .visit()
    .fillEmail('teste@email.com')
    .fillPassword('Jumpad@2025')
    .clickLoginButton()
    .waitForDashboard();
  cy.wait('@loginRequest', { timeout: 15000 }).then((interception) => {
    if (interception.response.statusCode === 200) {
      cy.wait('@tokenRequest', { timeout: 15000 });
      cy.wait('@userProfileRequest', { timeout: 15000 });
    }
  });
  cy.get('body').should('not.contain', 'loading');
});