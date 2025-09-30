// ===== PÁGINA DE LOGIN =====

export class LoginPage {
  
  // Método estático para visitar a página de login
  static visit() {
    cy.log('🌐 Visitando página de login...');
    cy.visit('/', { timeout: 30000 });
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    return LoginPage;
  }

  // Método estático para fazer login com credenciais válidas
  static performValidLogin() {
    cy.log('🔐 Fazendo login com credenciais válidas...');
    
    // Preencher credenciais de login
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('teste@email.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('Jumpad@2025');
    
    // Clicar no botão de login
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }

  // Método estático para fazer login com email incorreto
  static performWrongEmailLogin() {
    cy.log('🔐 Fazendo login com email incorreto...');
    
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('emailerrado@teste.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('Jumpad@2025');
    
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }

  // Método estático para fazer login com senha incorreta
  static performWrongPasswordLogin() {
    cy.log('🔐 Fazendo login com senha incorreta...');
    
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('teste@email.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('senhaerrada123');
    
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }

  // Método estático para fazer login com credenciais incorretas
  static performWrongCredentialsLogin() {
    cy.log('🔐 Fazendo login com credenciais incorretas...');
    
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('emailerrado@teste.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('senhaerrada123');
    
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }

  // Método estático para aguardar carregamento da página
  static waitForPageLoad() {
    cy.log('⏳ Aguardando carregamento da página...');
    
    // Aguardar login e redirecionamento
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    
    cy.log('✅ Página carregada com sucesso');
    return LoginPage;
  }

  // Método estático para validar sucesso do login
  static validateLoginSuccess() {
    cy.log('✅ Validando sucesso do login...');
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    return LoginPage;
  }

  // Método estático para validar falha do login
  static validateLoginFailure() {
    cy.log('❌ Validando falha do login...');
    cy.url({ timeout: 15000 }).should('include', '/');
    cy.url({ timeout: 15000 }).should('not.include', '/dashboard');
    return LoginPage;
  }

  // Método estático para login com credenciais válidas (método alternativo)
  static loginWithValidCredentials() {
    cy.log('🔐 Fazendo login com credenciais válidas...');
    
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('teste@email.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('Jumpad@2025');
    
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }

  // Método estático para login com credenciais inválidas
  static loginWithInvalidCredentials() {
    cy.log('🔐 Fazendo login com credenciais inválidas...');
    
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('emailerrado@teste.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('senhaerrada123');
    
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    return LoginPage;
  }
  
  // Fazer login no site (método de instância mantido para compatibilidade)
  fazerLogin() {
    cy.log('🔐 Fazendo login no site...');
    
    // Preencher credenciais de login
    cy.get('input[name="email"]')
      .should('be.visible')
      .type('teste@email.com');
    
    cy.get('input[name="password"]')
      .should('be.visible')
      .type('Jumpad@2025');
    
    // Clicar no botão de login
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    // Aguardar login e redirecionamento
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').should('not.contain', 'Entrar no Workspace');
    
    cy.log('✅ Login realizado com sucesso');
  }

  // Acessar a tela principal (dashboard) após o login
  acessarTelaPrincipal() {
    cy.log('🏠 Acessando tela principal (dashboard)...');
    
    // Navegar para o dashboard
    cy.visit('/dashboard', { timeout: 30000 });
    
    // Aguardar dashboard carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    
    // Verificar se está na tela principal
    cy.url().should('include', '/dashboard');
    
    // Aguardar elementos do dashboard carregarem
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Tela principal acessada com sucesso');
  }

  // Verificar se está na página principal (dashboard)
  verificarPaginaPrincipal() {
    cy.log('🔍 Verificando se está na página principal...');
    
    // Verificar título de boas-vindas
    cy.xpath('//h4[contains(text(), "Boas vindas")]')
      .should('be.visible');
    
    // Verificar botão "Criar novo agente"
    cy.xpath('//button[contains(text(), "Criar novo agente")]')
      .should('be.visible');
    
    cy.log('✅ Página principal verificada - pode prosseguir para o próximo passo');
  }
}