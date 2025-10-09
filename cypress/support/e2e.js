require('cypress-xpath');
import './commands'
import './screenshot-commands'
import './video-commands'
import 'cypress-xpath'
Cypress.on('uncaught:exception', (err, runnable) => {
  const ignoredErrors = [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Script error',
    'ChunkLoadError',
    'Loading chunk',
    'Loading CSS chunk',
    'Network request failed',
    'fetch is not defined'
  ];
  
  const shouldIgnore = ignoredErrors.some(error => 
    err.message.includes(error) || err.stack.includes(error)
  );
  
  if (shouldIgnore) {
    console.warn('Ignoring uncaught exception:', err.message);
    return false;
  }

  console.error('Uncaught exception:', err.message);
  console.error('Stack trace:', err.stack);
  
  return true;
});

beforeEach(() => {
  cy.window().then((win) => {
    if (win && win.clearTimeout) {
      win.clearTimeout();
    }
        if (win && win.clearInterval) {
      win.clearInterval();
    }
  });
});

afterEach(() => {
    cy.window().then((win) => {
    if (win.fetch) {
    win.fetch = () => Promise.reject(new Error('Test cleanup'));
    }
  });
});
Cypress.Commands.add('logTestStep', (step, details = '') => {
  const timestamp = new Date().toLocaleTimeString();
  cy.log(`[${timestamp}] ${step} ${details}`);
});