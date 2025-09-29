// Custom commands for screenshots and debugging

Cypress.Commands.add('takeScreenshot', (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotName = name ? `${name}-${timestamp}` : `screenshot-${timestamp}`;
  
  cy.screenshot(screenshotName, {
    capture: 'fullPage',
    overwrite: true
  });
});

Cypress.Commands.add('takeElementScreenshot', (selector, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotName = name ? `${name}-${timestamp}` : `element-${timestamp}`;
  
  cy.get(selector).screenshot(screenshotName, {
    overwrite: true
  });
});

Cypress.Commands.add('debugScreenshot', (message) => {
  cy.log(`🔍 DEBUG: ${message}`);
  cy.takeScreenshot(`debug-${message.replace(/\s+/g, '-').toLowerCase()}`);
});

Cypress.Commands.add('failureScreenshot', () => {
  cy.takeScreenshot('failure');
  cy.log('📸 Screenshot taken on failure');
});

// Auto screenshot on test failure
Cypress.on('fail', (error, runnable) => {
  cy.takeScreenshot(`failure-${runnable.title.replace(/\s+/g, '-').toLowerCase()}`);
  throw error;
});
