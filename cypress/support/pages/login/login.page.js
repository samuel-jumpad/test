class LoginPage {
  elements = {
    emailInput: () => cy.get('input[name="email"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    submitButton: () => cy.get('button[type="submit"]'),
    googleButton: () => cy.get('button').contains('Continuar com o Google'),
    forgotPasswordLink: () => cy.get('a').contains('Esqueceu sua senha?'),
    eyeIcon: () => cy.get('input[name="password"]').siblings('span'),
    workspaceTitle: () => cy.get('h6').contains('Entrar no Workspace'),
    errorMessage: () => cy.get('body').then(($body) => {
      // Try multiple selectors for error message
      if ($body.find('[data-slot="banner-description"]').length > 0) {
        return cy.get('[data-slot="banner-description"]').contains('O e-mail ou a senha estão incorretos');
      } else if ($body.find('.error-message').length > 0) {
        return cy.get('.error-message').contains('O e-mail ou a senha estão incorretos');
      } else if ($body.find('[class*="error"]').length > 0) {
        return cy.get('[class*="error"]').contains('O e-mail ou a senha estão incorretos');
      } else {
        // Fallback: look for the error text anywhere in the body
        return cy.get('body').contains('O e-mail ou a senha estão incorretos');
      }
    })
  };

  visit() {
    cy.visit('/', { timeout: 60000 });
    
    // Wait for page to be fully loaded and interactive
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'loading');
    
    // Wait for all critical elements to be visible and ready
    this.elements.emailInput().should('be.visible').and('be.enabled', { timeout: 30000 });
    this.elements.passwordInput().should('be.visible').and('be.enabled', { timeout: 30000 });
    this.elements.submitButton().should('be.visible').and('not.be.disabled', { timeout: 30000 });
    
    // Verificar se estamos na página de login verificando elementos essenciais
    cy.log('🔍 Verificando se estamos na página de login...');
    
    // Aguardar elementos essenciais do formulário de login
    cy.get('input[name="email"]').should('be.visible', { timeout: 30000 });
    cy.get('input[name="password"]').should('be.visible', { timeout: 30000 });
    cy.get('button[type="submit"]').should('be.visible', { timeout: 30000 });
    
    cy.log('✅ Elementos essenciais do login encontrados');
    
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
    
    // Wait for form submission to start (button may become disabled briefly)
    // Don't assert disabled state as it depends on API response
    cy.get('body').should('not.contain', 'loading');
    
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
    // Wait for redirect to complete
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    
    // Wait for dashboard to be fully loaded
    cy.get('body').should('not.contain', 'loading');
    
    // Verify we're no longer on login page
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    
    // Verify unique dashboard elements are visible
    cy.get('[data-slot="avatar-fallback"]', { timeout: 20000 }).should('be.visible');
    
    // Additional verification that we're no longer on login page
    cy.get('body').should('not.contain', 'O e-mail ou a senha estão incorretos');
    
    return this;
  }

  validateLoginFailure() {
    cy.log('🔍 Validando falha no login...');
    
    // Wait for page to stabilize after failed login attempt
    cy.wait(2000);
    
    // Verify we're still on login page (not redirected to dashboard)
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    
    // Verify form elements are still visible (login didn't succeed)
    cy.get('input[name="email"]').should('be.visible', { timeout: 15000 });
    cy.get('input[name="password"]').should('be.visible', { timeout: 15000 });
    cy.get('button[type="submit"]').should('be.visible', { timeout: 15000 });
    
    cy.log('✅ Falha no login validada com sucesso');
    
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