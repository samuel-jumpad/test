// scripts/generate-report.js
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

(async () => {
  try {
    console.log('🔄 Merging test results...');
    const json = await merge({ files: ['cypress/reports/**/*.json'] });

    console.log('📊 Generating HTML report...');
    const htmlPath = await generator.create(json, {
      reportDir: 'cypress/reports',
      reportTitle: 'Cypress Test Report',
      reportPageTitle: 'Cypress Test Results',
      inlineAssets: true,
      overwrite: true
    });

    console.log('✅ Report generated!');
    console.log(`📁 ${htmlPath}`);
  } catch (e) {
    console.error('❌ Error generating report:', e);
    process.exit(1);
  }
})();
