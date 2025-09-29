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
    cy.visit('/', { timeout: 30000 });
    // Wait for page to fully load
    cy.wait(2000);
    this.elements.emailInput().should('be.visible', { timeout: 15000 });
    this.elements.passwordInput().should('be.visible', { timeout: 15000 });
    this.elements.submitButton().should('be.visible');
    this.elements.workspaceTitle().should('be.visible');
    cy.url().should('include', '/');
    return this;
  }

  typeEmail(email) {
    this.elements.emailInput()
      .should('be.visible')
      .clear()
      .wait(500)
      .type(email, { delay: 150 })
      .should('have.value', email);
    return this;
  }

  typePassword(password) {
    this.elements.passwordInput()
      .should('be.visible')
      .clear()
      .wait(500)
      .type(password, { delay: 150 })
      .should('have.value', password);
    return this;
  }

  clickSubmit() {
    cy.wait(1000);
    this.elements.submitButton()
      .should('be.visible')
      .should('be.enabled')
      .click();
    // Wait for form submission
    cy.wait(2000);
    return this;
  }

  clickGoogleButton() {
    this.elements.googleButton().click();
    return this;
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
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
    // Wait for redirect to complete
    cy.wait(3000);
    cy.location('pathname', { timeout: 30000 }).should('include', '/dashboard');
    cy.url().should('include', '/dashboard');
    cy.get('[data-slot="avatar-fallback"]').should('be.visible');
    cy.get('body').should('not.contain', 'O e-mail ou a senha estão incorretos');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    return this;
  }

  validateLoginFailure() {
    // Wait for error message to appear
    cy.wait(2000);
    cy.url().should('include', '/');
    this.elements.workspaceTitle().should('be.visible');
    this.elements.errorMessage().should('be.visible');
    this.elements.emailInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
    this.elements.submitButton().should('be.visible');
    cy.location('pathname').should('not.include', '/dashboard');
    return this;
  }

  waitForPageLoad() {
    cy.wait(2000);
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