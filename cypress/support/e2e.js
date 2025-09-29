// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
require('cypress-xpath');
// Import commands.js using ES2015 syntax:
import './commands'
import './screenshot-commands'
import './video-commands'

// Import cypress-xpath
import 'cypress-xpath'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Enhanced global error handling for CI/CD stability
Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't fail tests on common browser errors
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
  
  // Log other errors for debugging
  console.error('Uncaught exception:', err.message);
  console.error('Stack trace:', err.stack);
  
  return true;
});

// Global before hook for all tests
beforeEach(() => {
  // Don't setup interceptors globally - let each test handle its own
  // This prevents conflicts with tests that need specific interceptor configurations
  
  // Take screenshot before each test
  cy.takeScreenshot('test-start');
  
  // Ensure clean state
  cy.window().then((win) => {
    // Clear any pending timeouts
    if (win.clearTimeout) {
      win.clearTimeout();
    }
    // Clear any pending intervals
    if (win.clearInterval) {
      win.clearInterval();
    }
  });
});

// Global after hook for all tests
afterEach(() => {
  // Take screenshot after each test
  cy.takeScreenshot('test-end');
  
  // Clean up any pending requests
  cy.window().then((win) => {
    if (win.fetch) {
      // Abort any pending fetch requests
      win.fetch = () => Promise.reject(new Error('Test cleanup'));
    }
  });
});

// Custom logging
Cypress.Commands.add('logTestStep', (step, details = '') => {
  const timestamp = new Date().toLocaleTimeString();
  cy.log(`[${timestamp}] ${step} ${details}`);
  cy.takeScreenshot(`step-${step.replace(/\s+/g, '-').toLowerCase()}`);
});