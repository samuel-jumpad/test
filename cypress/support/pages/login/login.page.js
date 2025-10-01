class LoginPage {
  // Acessar a URL de login
  visit() {
    cy.visit('https://fusion-frontend-7.jumpad.dev/');
    cy.log('✅ URL acessada com sucesso');
    return this;
  }

  // Aguardar página carregar
  waitForPageLoad() {
    cy.get('body').should('be.visible');
    cy.wait(2000);
    return this;
  }

  // Preencher email
  fillEmail(email = 'teste@email.com') {
    cy.log('📧 Preenchendo email...');
    cy.get('input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="Email"]')
      .should('be.visible')
      .clear()
      .type(email, { delay: 100 });
    cy.log(`✅ Email preenchido: ${email}`);
    return this;
  }

  // Preencher senha
  fillPassword(password = 'Jumpad@2025') {
    cy.log('🔒 Preenchendo senha...');
    cy.get('input[type="password"], input[name="password"], input[placeholder*="senha" i], input[placeholder*="password" i]')
      .should('be.visible')
      .clear()
      .type(password, { delay: 100 });
    cy.log('✅ Senha preenchida');
    return this;
  }

  // Clicar no botão de login
  clickLoginButton() {
    cy.log('🔑 Clicando no botão de login...');
    cy.get('button[type="submit"], button:contains("Entrar"), button:contains("Login"), button:contains("Sign in")')
      .should('be.visible')
      .click();
    cy.log('✅ Botão de login clicado');
    return this;
  }

  // Aguardar redirecionamento para dashboard
  waitForDashboard() {
    cy.log('⏳ Aguardando redirecionamento...');
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    cy.log('✅ Redirecionado para dashboard');
    
    // Aguardar carregamento completo da página
    cy.log('⏳ Aguardando carregamento completo...');
    cy.get('body').should('not.contain', 'loading', { timeout: 10000 });
    cy.wait(2000);
    cy.log('✅ Página carregada completamente');
    return this;
  }

  // Login completo
  login(email = 'teste@email.com', password = 'Jumpad@2025') {
    this.visit()
      .waitForPageLoad()
      .fillEmail(email)
      .fillPassword(password)
      .clickLoginButton()
      .waitForDashboard();
    return this;
  }

  // Validar dashboard
  validateDashboard() {
    cy.log('📋 Validando dashboard...');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Dashboard carregado com sucesso');
    return this;
  }

  // Método para fazer login seguindo o padrão do teste de agente
  fazerLogin() {
    this.visit()
      .waitForPageLoad()
      .fillEmail('teste@email.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton()
      .waitForDashboard();
    return this;
  }

  // Métodos estáticos para os testes de login
  static visit() {
    const instance = new LoginPage();
    instance.visit();
    return instance;
  }

  static performValidLogin() {
    const instance = new LoginPage();
    return instance
      .fillEmail('teste@email.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton()
      .waitForDashboard();
  }

  static performWrongEmailLogin() {
    const instance = new LoginPage();
    return instance
      .fillEmail('emailerrado@teste.com')
      .fillPassword('Jumpad@2025')
      .clickLoginButton();
  }

  static performWrongPasswordLogin() {
    const instance = new LoginPage();
    return instance
      .fillEmail('teste@email.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
  }

  static performWrongCredentialsLogin() {
    const instance = new LoginPage();
    return instance
      .fillEmail('emailerrado@teste.com')
      .fillPassword('senhaerrada')
      .clickLoginButton();
  }
}

export { LoginPage };