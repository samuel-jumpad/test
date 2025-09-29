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

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't fail tests on uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Global before hook for all tests
beforeEach(() => {
  // Take screenshot before each test
  cy.takeScreenshot('test-start');
});

// Global after hook for all tests
afterEach(() => {
  // Take screenshot after each test
  cy.takeScreenshot('test-end');
});

// Custom logging
Cypress.Commands.add('logTestStep', (step, details = '') => {
  const timestamp = new Date().toLocaleTimeString();
  cy.log(`[${timestamp}] ${step} ${details}`);
  cy.takeScreenshot(`step-${step.replace(/\s+/g, '-').toLowerCase()}`);
});