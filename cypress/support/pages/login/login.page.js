class LoginPage {
  elements = {
    emailInput: () => cy.get('input[name="email"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    submitButton: () => cy.get('button[type="submit"]'),
    googleButton: () => cy.get('button').contains('Continuar com o Google'),
    forgotPasswordLink: () => cy.get('a').contains('Esqueceu sua senha?'),
    eyeIcon: () => cy.get('input[name="password"]').siblings('span'),
    workspaceTitle: () => cy.get('h6').contains('Entrar no Workspace'),
    errorMessage: () => cy.get('[data-slot="banner-description"]').contains('O e-mail ou a senha estão incorretos')
  };

  visit() {
    cy.visit('/', { timeout: 45000 });
    
    // Wait for page to be fully loaded and interactive
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'loading');
    
    // Wait for all critical elements to be visible and ready
    this.elements.emailInput().should('be.visible').and('be.enabled', { timeout: 20000 });
    this.elements.passwordInput().should('be.visible').and('be.enabled', { timeout: 20000 });
    this.elements.submitButton().should('be.visible').and('not.be.disabled', { timeout: 20000 });
    this.elements.workspaceTitle().should('be.visible', { timeout: 15000 });
    
    // Ensure we're on the correct page
    cy.url().should('include', '/');
    cy.location('pathname').should('eq', '/');
    
    return this;
  }

  typeEmail(email) {
    this.elements.emailInput()
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type(email, { delay: 100 })
      .should('have.value', email)
      .and('not.be.disabled');
    return this;
  }

  typePassword(password) {
    this.elements.passwordInput()
      .should('be.visible')
      .and('be.enabled')
      .clear()
      .type(password, { delay: 100 })
      .should('have.value', password)
      .and('not.be.disabled');
    return this;
  }

  clickSubmit() {
    // Ensure button is ready for interaction
    this.elements.submitButton()
      .should('be.visible')
      .and('be.enabled')
      .and('not.be.disabled')
      .click();
    
    // Wait for form submission to start (button should become disabled)
    this.elements.submitButton().should('be.disabled');
    
    return this;
  }

  clickGoogleButton() {
    this.elements.googleButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
    return this;
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink()
      .should('be.visible')
      .and('be.enabled')
      .click();
    return this;
  }

  togglePasswordVisibility() {
    this.elements.eyeIcon().click({ force: true });
    return this;
  }

  loginWithCredentials(email, password) {
    this.typeEmail(email);
    this.typePassword(password);
    this.clickSubmit();
    return this;
  }

  loginWithValidCredentials() {
    cy.fixture('users').then((users) => {
      this.loginWithCredentials(users.valid.email, users.valid.password);
    });
    return this;
  }

  loginWithInvalidCredentials() {
    cy.fixture('users').then((users) => {
      this.loginWithCredentials(users.invalid.email, users.invalid.password);
    });
    return this;
  }

  loginWithWrongEmail() {
    cy.fixture('users').then((users) => {
      this.loginWithCredentials(users.invalidEmail.email, users.valid.password);
    });
    return this;
  }

  loginWithWrongPassword() {
    cy.fixture('users').then((users) => {
      this.loginWithCredentials(users.valid.email, users.invalidPassword.password);
    });
    return this;
  }


  validateLoginSuccess() {
    // Wait for redirect to complete with intelligent waiting
    cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    
    // Wait for dashboard to be fully loaded
    cy.get('body').should('not.contain', 'loading');
    cy.get('[data-slot="avatar-fallback"]', { timeout: 20000 }).should('be.visible');
    
    // Verify we're no longer on login page
    cy.get('body').should('not.contain', 'O e-mail ou a senha estão incorretos');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    
    // Additional verification that login was successful
    cy.get('h6').should('not.contain', 'Entrar no Workspace');
    
    return this;
  }

  validateLoginFailure() {
    // Wait for error message to appear with intelligent waiting
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.location('pathname', { timeout: 15000 }).should('not.include', '/dashboard');
    
    // Verify we're still on login page
    this.elements.workspaceTitle().should('be.visible', { timeout: 15000 });
    
    // Wait for error message to appear
    this.elements.errorMessage().should('be.visible', { timeout: 10000 });
    
    // Verify form elements are still visible and ready for retry
    this.elements.emailInput().should('be.visible').and('be.enabled');
    this.elements.passwordInput().should('be.visible').and('be.enabled');
    this.elements.submitButton().should('be.visible').and('be.enabled');
    
    return this;
  }

  waitForPageLoad() {
    // Wait for page to be fully interactive
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'loading');
    cy.document().should('have.property', 'readyState', 'complete');
    return this;
  }

  performValidLogin() {
    this.loginWithValidCredentials();
    this.validateLoginSuccess();
    return this;
  }

  performInvalidLogin() {
    this.loginWithInvalidCredentials();
    this.validateLoginFailure();
    return this;
  }

  performWrongEmailLogin() {
    this.loginWithWrongEmail();
    this.validateLoginFailure();
    return this;
  }

  performWrongPasswordLogin() {
    this.loginWithWrongPassword();
    this.validateLoginFailure();
    return this;
  }

  performWrongCredentialsLogin() {
    this.loginWithInvalidCredentials();
    this.validateLoginFailure();
    return this;
  }

}

export default new LoginPage();