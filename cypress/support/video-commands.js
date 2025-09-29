// Custom commands for video recording and debugging

Cypress.Commands.add('startVideoRecording', (testName) => {
  cy.log(`🎥 Starting video recording for: ${testName}`);
  // Video recording is automatically handled by Cypress config
  // This command is for logging purposes
});

Cypress.Commands.add('stopVideoRecording', () => {
  cy.log('🛑 Stopping video recording');
  // Video recording is automatically handled by Cypress config
  // This command is for logging purposes
});

Cypress.Commands.add('pauseVideo', () => {
  cy.log('⏸️ Video paused');
  // Note: Cypress doesn't support pausing video recording
  // This is for documentation purposes
});

Cypress.Commands.add('resumeVideo', () => {
  cy.log('▶️ Video resumed');
  // Note: Cypress doesn't support resuming video recording
  // This is for documentation purposes
});

// Video quality settings
Cypress.Commands.add('setVideoQuality', (quality = 'medium') => {
  const qualitySettings = {
    low: 16,
    medium: 32,
    high: 64,
    ultra: 128
  };
  
  cy.log(`🎬 Setting video quality to: ${quality} (compression: ${qualitySettings[quality]})`);
  // Note: Video quality is set in cypress.config.js
  // This command is for documentation purposes
});

// Video debugging
Cypress.Commands.add('logVideoInfo', () => {
  cy.log('📹 Video recording info:');
  cy.log('- Videos folder: cypress/videos');
  cy.log('- Compression: 32 (medium quality)');
  cy.log('- Auto-generated on test completion');
  cy.log('- Failed tests always recorded');
});
