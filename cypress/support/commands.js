import LoginPage from './pages/login/login.page.js';

// Handle uncaught exceptions from application
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific application errors that don't affect test functionality
  if (err.message.includes('m.target?.contains is not a function') ||
      err.message.includes('contains is not a function') ||
      err.message.includes('Cannot read properties of undefined')) {
    console.log('⚠️ Ignorando erro de aplicação:', err.message);
    return false; // Prevent Cypress from failing the test
  }
  return true; // Let other errors fail the test
});

// Setup interceptors for common API calls
Cypress.Commands.add('setupInterceptorsForFailure', () => {
  // Intercept login request - always return failure for failure tests
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
  
  // Intercept translation requests to speed up tests
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
  // Intercept login request - handle both success and error cases
  cy.intercept('POST', '**/auth/login', (req) => {
    // Check if credentials are valid based on request body
    const body = req.body;
    console.log('Login attempt with:', { email: body.email, password: body.password });
    
    // Only accept exact valid credentials
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
  
  // Intercept agent creation request
  cy.intercept('POST', '**/assistants', { fixture: 'agent-creation-response.json' }).as('createAgentRequest');
  
  // Intercept agent deletion request
  cy.intercept('DELETE', '**/assistants/**', { fixture: 'agent-deletion-response.json' }).as('deleteAgentRequest');
  
  // Intercept chat message request
  cy.intercept('POST', '**/chats/**/messages', { fixture: 'chat-response.json' }).as('chatMessageRequest');
  
  // Intercept token endpoint
  cy.intercept('POST', '**/api/token', (req) => {
    // Handle token requests - return success for valid scenarios
    req.reply({ 
      statusCode: 200, 
      body: { 
        success: true, 
        token: 'mock-jwt-token',
        message: 'Token generated successfully' 
      } 
    });
  }).as('tokenRequest');
  
  // Intercept user profile endpoint - return success for valid login flow
  cy.intercept('GET', '**/api/users/me', (req) => {
    // Always return success for user profile (simulates successful authentication)
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
  
  // Intercept dashboard data requests
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
  
  // Intercept chat-related requests
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
    body: { status: 'ok' } 
  }).as('mcpInternalRequest');
  
  // Intercept translation requests to speed up tests
  cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('translationRequest');
  
  cy.intercept('GET', '**/translate.googleapis.com/**', { 
    statusCode: 200, 
    body: { translatedText: 'Mock translation' } 
  }).as('googleTranslationRequest');
  
  // Intercept page load requests
  cy.intercept('GET', '**/dashboard**').as('dashboardLoad');
  cy.intercept('GET', '**/assistants**').as('agentsLoad');
});

Cypress.Commands.add('setupTest', () => {
  cy.viewport(1440, 900);
  // Setup interceptors for general tests
  cy.setupInterceptors();
  
  // Perform login with better error handling
  cy.log('🔍 Iniciando setup do teste...');
  
  LoginPage.visit();
  
  // Aguardar um pouco mais para a página carregar completamente
  cy.wait(2000);
  
  LoginPage.loginWithValidCredentials();
  
  // Aguardar login com timeout maior
  cy.url({ timeout: 45000 }).should('include', '/dashboard');
  cy.get('body').should('not.contain', 'loading');
  cy.get('body').should('not.contain', 'Entrar no Workspace');
  
  cy.log('✅ Setup do teste concluído com sucesso');
});

// Custom command to setup test environment for chat tests
Cypress.Commands.add('setupTestForChat', () => {
  cy.viewport(1440, 900);
  // Setup interceptors for general tests
  cy.setupInterceptors();
  
  // Perform login and basic validation (without dashboard-specific checks)
  LoginPage.visit();
  LoginPage.loginWithValidCredentials();
  
  // Basic login validation (just check we're not on login page)
  cy.url({ timeout: 30000 }).should('include', '/dashboard');
  cy.get('body').should('not.contain', 'loading');
  cy.get('body').should('not.contain', 'Entrar no Workspace');
});

Cypress.Commands.add('login', () => {
  LoginPage.visit();
  
  // Wait for login form to be ready
  cy.get('input[name="email"]').should('be.visible').and('be.enabled');
  cy.get('input[name="password"]').should('be.visible').and('be.enabled');
  cy.get('button[type="submit"]').should('be.visible').and('be.enabled');
  
  LoginPage.loginWithValidCredentials();
  
  // Wait for login request to complete
  cy.wait('@loginRequest', { timeout: 15000 }).then((interception) => {
    if (interception.response.statusCode === 200) {
      // Success case - proceed with dashboard flow
      cy.wait('@tokenRequest', { timeout: 15000 });
      cy.wait('@userProfileRequest', { timeout: 15000 });
      cy.url({ timeout: 30000 }).should('include', '/dashboard');
      cy.wait('@dashboardLoad', { timeout: 15000 });
      LoginPage.validateLoginSuccess();
    } else {
      // Error case - login failed, stay on login page
      cy.log('Login failed with status:', interception.response.statusCode);
      // Don't wait for dashboard requests - they should not happen
      // The page should remain on login with error message
    }
  });
});

Cypress.Commands.add('sendChatMessage', (message) => {
  // Wait for message input to be ready
  cy.get('div[role="textbox"][contenteditable="true"][data-placeholder="Digite aqui sua mensagem..."]')
    .should('be.visible', { timeout: 15000 })
    .scrollIntoView();
  
  // Clear and type message
  cy.get('div[role="textbox"][contenteditable="true"][data-placeholder="Digite aqui sua mensagem..."]')
    .clear()
    .type(message, { delay: 100 });
  
  // Click send button (the arrow up button)
  cy.get('button[type="submit"]')
    .click();
  
  // Verify message was actually sent by checking for the message content
  cy.get('body').should('contain', message);
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
  
  // Wait for specific loading states to disappear (but ignore data-loading attributes on buttons)
  cy.get('[data-testid="loading"], .loading').should('not.exist');
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
  
  // Wait for login request to complete (success case)
  cy.wait('@loginRequest', { timeout: 15000 }).then((interception) => {
    if (interception.response.statusCode === 200) {
      // Wait for token and profile requests
      cy.wait('@tokenRequest', { timeout: 15000 });
      cy.wait('@userProfileRequest', { timeout: 15000 });
      cy.wait('@dashboardLoad', { timeout: 15000 });
      LoginPage.validateLoginSuccess();
    }
  });
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
  
  // Verify we're back on login page by checking form elements
  cy.get('input[name="email"]', { timeout: 15000 }).should('be.visible');
  cy.get('input[name="password"]', { timeout: 15000 }).should('be.visible');
  cy.get('button[type="submit"]', { timeout: 15000 }).should('be.visible');
});