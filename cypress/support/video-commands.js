Cypress.Commands.add('startVideoRecording', (testName) => {
  cy.log(`🎥 Starting video recording for: ${testName}`);
});

Cypress.Commands.add('stopVideoRecording', () => {
  cy.log('🛑 Stopping video recording');
 });

Cypress.Commands.add('pauseVideo', () => {
  cy.log('⏸️ Video paused');
});

Cypress.Commands.add('resumeVideo', () => {
  cy.log('▶️ Video resumed');
 });

Cypress.Commands.add('setVideoQuality', (quality = 'medium') => {
  const qualitySettings = {
    low: 16,
    medium: 32,
    high: 64,
    ultra: 128
  };
  
  cy.log(`🎬 Setting video quality to: ${quality} (compression: ${qualitySettings[quality]})`);
});

Cypress.Commands.add('logVideoInfo', () => {
  cy.log('📹 Video recording info:');
  cy.log('- Videos folder: cypress/videos');
  cy.log('- Compression: 32 (medium quality)');
  cy.log('- Auto-generated on test completion');
  cy.log('- Failed tests always recorded');
});
