# Cypress Test Automation Framework

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-repo/cypress-automation)
[![Cypress](https://img.shields.io/badge/cypress-13.0.0-green.svg)](https://www.cypress.io/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

A comprehensive end-to-end testing framework built with Cypress, implementing Page Object Model pattern, automated screenshots, video recording, and detailed reporting capabilities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)


## Features

- **Page Object Model**: Maintainable and reusable test structure
- **Automated Screenshots**: Failure capture and debugging support
- **Video Recording**: Complete test execution recordings
- **Comprehensive Reporting**: HTML, JSON, and XML report generation
- **Cross-browser Testing**: Chrome, Firefox, and Edge support
- **CI/CD Integration**: Ready for continuous integration
- **Custom Commands**: Reusable test utilities
- **Data-driven Testing**: Fixture-based test data management

## Pre Requisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Chrome, Firefox, or Edge browser
- Windows 10/11, macOS, or Linux

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cypress-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Cypress (if not already installed)

```bash
npm install --save-dev cypress
```

### 4. Install Additional Dependencies

```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator rimraf
```

### 5. Verify Installation

```bash
npx cypress --version
```

## Project Structure

```
cypress-automation/
├── cypress/
│   ├── e2e/                    # Test files
│   │   └── login/
│   │       └── login.cy.js
│   ├── support/                # Support files
│   │   ├── pages/              # Page Object classes
│   │   │   └── login/
│   │   │       └── login.page.js
│   │   ├── commands.js         # Custom commands
│   │   ├── screenshot-commands.js
│   │   ├── video-commands.js
│   │   └── e2e.js             # Global configuration
│   ├── fixtures/              # Test data
│   ├── screenshots/           # Screenshot outputs
│   ├── videos/                # Video recordings
│   └── reports/               # Test reports
├── scripts/
│   └── generate-report.js     # Report generation script
├── cypress.config.js         # Cypress configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## Architecture

### Page Object Model (POM)

The framework follows the Page Object Model pattern for maintainable and scalable test automation:

```javascript
class LoginPage {
  elements = {
    emailInput: () => cy.get('input[name="email"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    submitButton: () => cy.get('button[type="submit"]')
  };

  visit() {
    cy.visit('/');
    return this;
  }

  loginWithCredentials(email, password) {
    this.elements.emailInput().type(email);
    this.elements.passwordInput().type(password);
    this.elements.submitButton().click();
    return this;
  }
}
```

### Custom Commands

Reusable commands for common test operations:

```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  LoginPage.loginWithCredentials(email, password);
});

Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});
```

### Test Organization

- **E2E Tests**: Located in `cypress/e2e/`
- **Page Objects**: Located in `cypress/support/pages/`
- **Custom Commands**: Located in `cypress/support/`
- **Fixtures**: Test data in `cypress/fixtures/`

## Configuration

### Cypress Configuration (`cypress.config.js`)

```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://jumpad.com',
    viewportWidth: 1440,
    viewportHeight: 900,
    
    // Screenshots
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Video recording
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 1
    },
    
    // Reporter configuration
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    }
  }
});
```

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
CYPRESS_BASE_URL=https://your-app.com
CYPRESS_API_URL=https://api.your-app.com
CYPRESS_TEST_USER=test@example.com
```

## Usage

### Running Tests

#### Interactive Mode (Recommended for Development)

```bash
# Open Cypress Test Runner
npx cypress open

# Run specific test file
npx cypress run --spec "cypress/e2e/login/login.cy.js"
```

#### Headless Mode (CI/CD)

```bash
# Run all tests
npm run cy:run

# Run with specific browser
npm run cy:run:chrome
npm run cy:run:firefox
npm run cy:run:edge

# Run specific test suite
npm run test:login
```

#### Debug Mode

```bash
# Run with debug information
npm run test:debug

# Run with video recording
npm run cy:run:headed
```

### Available Scripts

```bash
# Test execution
npm run cy:open              # Open Cypress GUI
npm run cy:run               # Run all tests headless
npm run cy:run:headed        # Run tests with browser visible
npm run test:login           # Run login tests only

# Reporting
npm run report:generate      # Generate HTML reports
npm run report:open          # Open generated reports
npm run test:full            # Run tests + generate reports

# Maintenance
npm run clean:reports        # Clean old reports
npm run clean:all            # Clean all generated files
```

## Best Practices

### 1. Page Object Model

- Keep page objects focused on single pages
- Use descriptive method names
- Return `this` for method chaining
- Separate actions from assertions

### 2. Test Data Management

```javascript
// Use fixtures for test data
cy.fixture('users').then((users) => {
  LoginPage.loginWithCredentials(users.valid.email, users.valid.password);
});
```

### 3. Custom Commands

```javascript
// Create reusable commands
Cypress.Commands.add('loginAs', (userType) => {
  cy.fixture('users').then((users) => {
    LoginPage.loginWithCredentials(users[userType].email, users[userType].password);
  });
});
```

### 4. Screenshots and Debugging

```javascript
// Take screenshots at key points
cy.takeScreenshot('before-login');
cy.takeScreenshot('after-login');

// Debug with custom commands
cy.debugScreenshot('form-validation-error');
```

### 5. Error Handling

```javascript
// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});
```

## Reporting

### HTML Reports

Generate comprehensive HTML reports with screenshots and videos:

```bash
npm run report:generate
```

Reports include:
- Test execution timeline
- Screenshots of failures
- Video recordings
- Performance metrics
- Detailed error information

### Report Locations

- **HTML Report**: `cypress/reports/mochawesome.html`
- **JSON Report**: `cypress/reports/mochawesome.json`
- **XML Report**: `cypress/reports/mochawesome.xml`

### Screenshots and Videos

- **Screenshots**: `cypress/screenshots/`
- **Videos**: `cypress/videos/`
- **Reports**: `cypress/reports/`

## Troubleshooting

### Common Issues

#### 1. PowerShell Execution Policy

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. XPath Not Found

Install cypress-xpath:

```bash
npm install --save-dev cypress-xpath
```

#### 3. Video Recording Issues

- Ensure sufficient disk space
- Check video compression settings
- Verify browser permissions

#### 4. Report Generation Fails

```bash
# Install required dependencies
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=cypress:* npm run cy:run
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration
- Write descriptive test names
- Include proper documentation
- Add appropriate assertions
- Use Page Object Model pattern


## Support

For support and questions:

- Create an issue in the repository
- Check the [Cypress documentation](https://docs.cypress.io/)
- Review the troubleshooting section

## Changelog

### Version 1.0.0

- Initial release
- Page Object Model implementation
- Screenshot and video recording
- Comprehensive reporting
- Cross-browser support
- CI/CD integration ready# test
