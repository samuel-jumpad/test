const { defineConfig } = require("cypress");

module.exports = defineConfig({
    reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true
  },
    
  e2e: {
    baseUrl: 'https://qa.jumpad.dev',
    viewportWidth: 1440,
    viewportHeight: 900,
    
    // Screenshots configuration
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    
    // Video recording configuration
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    
    // Test retry configuration
    retries: {
      runMode: 2,
      openMode: 1
    },
    
    // Default command timeout
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
    },
  },
});
