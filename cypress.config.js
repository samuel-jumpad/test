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
    
    // Screenshots configuration - optimized for CI/CD
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    
    // Browser configuration for stability
    chromeWebSecurity: false,
    experimentalStudio: true,
    
    // Video recording configuration - optimized for CI/CD
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    videoUploadOnPasses: false,
    
    // Test retry configuration - reduced to avoid masking real issues
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    // Enhanced timeouts for CI/CD environments
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    pageLoadTimeout: 45000,
    execTimeout: 60000,
    
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
      
      // Add performance monitoring
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
          // Add Chrome flags for better stability in CI/CD
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--window-size=1440,900');
        }
        return launchOptions;
      });
    },
  },
});
