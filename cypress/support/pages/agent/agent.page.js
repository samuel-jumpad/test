// ===== PÁGINA DE AGENTE =====

export class AgentPage {
  
  // ===== FUNÇÕES DE NAVEGAÇÃO =====
  
  // Navega para a página de agentes via dashboard
  navegarParaAgentes() {
    cy.log('🔍 Navegando para página de Agentes...');
    
    // Aguarda a página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tenta encontrar o menu Agentes com seletores CSS
    cy.get('body').then(($body) => {
      // Tenta encontrar por texto "Agentes"
      if ($body.find('span:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por span');
        cy.get('span:contains("Agentes")').first().click();
      } else if ($body.find('div:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por div');
        cy.get('div:contains("Agentes")').first().click();
      } else if ($body.find('button:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por button');
        cy.get('button:contains("Agentes")').first().click();
      } else {
        cy.log('⚠️ Menu Agentes não encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants', { timeout: 30000 });
      }
    });
    
    // Aguarda a página de agentes carregar
    cy.url({ timeout: 15000 }).should('include', '/assistants');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Navegação para Agentes concluída');
  }

  // ===== FUNÇÕES DE CRIAÇÃO =====

  // Função principal para criar um novo agente
  criarNovoAgente(agentName, description = 'Relacionado a teste automatizado') {
    cy.log(`🤖 Criando novo agente: ${agentName}`);
    
    // Aguarda a página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tenta encontrar o botão "Cadastrar Novo Agente" com múltiplos seletores
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por button');
        cy.get('button:contains("Cadastrar Novo Agente")').first().click();
      } else if ($body.find('a:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por link');
        cy.get('a:contains("Cadastrar Novo Agente")').first().click();
      } else if ($body.find('div:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por div');
        cy.get('div:contains("Cadastrar Novo Agente")').first().click();
      } else {
        cy.log('⚠️ Botão não encontrado, tentando navegar diretamente...');
        cy.visit('/dashboard/assistants/new', { timeout: 30000 });
      }
    });

    // Aguardar formulário carregar
    cy.contains('button', 'Personalizar').should('be.visible');
    cy.contains('button', 'Configurações').should('be.visible');
    cy.contains('button', 'Servidores MCP').should('be.visible');

    // Preencher nome
    cy.xpath('//input[@name="name"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 150 });

    // Preencher descrição
    cy.xpath('//textarea[@name="description"]')
      .should('be.visible')
      .clear()
      .type(description, { delay: 150 });

    // Preencher texto rico
    cy.xpath('//textarea[contains(@class,"w-md-editor-text-input")]')
      .should('be.visible')
      .clear()
      .type('Teste automatizado Cypress', { delay: 150 });

    // Scroll até o botão Salvar
    cy.xpath('//*[@data-radix-scroll-area-viewport]')
      .scrollTo('bottom', { duration: 2000 });

    // Clicar em Salvar
    cy.xpath('//button[@type="submit"]')
      .should('be.visible')
      .click();

    // Validar criação
    this.validarAgenteCriado(agentName);
  }

  // Valida se o agente foi criado com sucesso
  validarAgenteCriado(agentName) {
    cy.log(`✅ Validando criação do agente: ${agentName}`);
    
    // Confirmações de sucesso
    cy.xpath('//div[contains(text(), "Agente criado")]')
      .should('be.visible');

    cy.xpath('//div[contains(text(), "O agente foi criado com sucesso!")]')
      .should('be.visible');
    
    cy.log(`✅ Agente "${agentName}" criado com sucesso`);
  }

  // ===== FUNÇÕES DE DELEÇÃO =====

  // Busca o agente na lista para preparar a deleção
  buscarAgente(agentName) {
    cy.log(`🔍 Buscando agente: ${agentName}`);
    
    // Digita o nome no campo de busca
    cy.xpath('//input[@type="search" and @placeholder="Buscar por nome"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 100 });

    // Aguarda a tabela carregar
    cy.wait(3000);

    // Verifica se o agente aparece
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]')
      .should('be.visible')
      .scrollIntoView();
    
    cy.log(`✅ Agente "${agentName}" encontrado`);
  }

  // Função principal para deletar um agente
  deletarAgente(agentName) {
    cy.log(`🗑️ Deletando agente: ${agentName}`);
    
    // Buscar o agente
    this.buscarAgente(agentName);
    
    // Debug: verifica se a linha da tabela existe
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr')
      .should('exist')
      .should('be.visible');

    // Debug: verifica se existe algum botão na linha
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr//button')
      .should('exist')
      .should('have.length.greaterThan', 0);

    // Clica no botão de lixeira (último botão da linha)
    cy.get('table tbody tr')
      .contains(agentName)
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();

    // Confirma a exclusão no modal
    cy.xpath('//button[contains(@class,"bg-[#e81b37]")]//div[contains(text(),"Deletar agente")]')
      .should('be.visible')
      .click();

    // Valida a deleção
    this.validarDelecaoSucesso();
  }

  // Valida se a deleção foi bem-sucedida
  validarDelecaoSucesso() {
    cy.log('✅ Validando deleção do agente...');
    
    // Aguarda o toast aparecer e valida o conteúdo
    cy.wait(2000);

    // Valida que a mensagem de sucesso apareceu
    cy.contains('Agente removido').should('be.visible');
    
    cy.log('✅ Agente deletado com sucesso');
  }

  // ===== FUNÇÕES DE ACESSO A AGENTES ANTIGOS =====

  // Acessa um agente antigo existente
  accessOldAgent() {
    cy.log('🔍 Acessando agente antigo...');
    
    // Navegar para a página de agentes
    this.navegarParaAgentes();
    
    // Aguardar a lista de agentes carregar
    cy.wait(3000);
    
    // Clicar no primeiro agente da lista (assumindo que existe pelo menos um)
    cy.get('table tbody tr')
      .first()
      .should('be.visible')
      .click();
    
    cy.log('✅ Agente antigo acessado com sucesso');
    return this;
  }

  // Aguarda o carregamento da página do agente
  waitForPageLoad() {
    cy.log('⏳ Aguardando carregamento da página do agente...');
    
    // Aguardar elementos específicos da página do agente carregarem
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Página do agente carregada com sucesso');
    return this;
  }

  // Captura dados do agente acessado
  capturarDadosDoAgente() {
    cy.log('📊 Capturando dados do agente...');
    
    const dadosAgente = {};
    
    // Capturar nome do agente
    cy.get('h1, h2, h3').first().then(($el) => {
      dadosAgente.nome = $el.text().trim();
      cy.log(`📝 Nome do agente: ${dadosAgente.nome}`);
    });
    
    // Capturar descrição se disponível
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="description"], .description, p').length > 0) {
        cy.get('[data-testid="description"], .description, p').first().then(($desc) => {
          dadosAgente.descricao = $desc.text().trim();
          cy.log(`📄 Descrição: ${dadosAgente.descricao}`);
        });
      }
    });
    
    // Capturar URL atual
    cy.url().then((url) => {
      dadosAgente.url = url;
      cy.log(`🔗 URL do agente: ${dadosAgente.url}`);
    });
    
    // Capturar timestamp
    dadosAgente.timestamp = new Date().toISOString();
    cy.log(`⏰ Timestamp: ${dadosAgente.timestamp}`);
    
    // Armazenar dados no window para acesso posterior
    cy.window().then((win) => {
      win.dadosAgenteAcessado = dadosAgente;
    });
    
    cy.log('✅ Dados do agente capturados com sucesso');
    return this;
  }

  // Valida se está na página correta do agente
  validarPaginaDoAgente() {
    cy.log('✅ Validando página do agente...');
    
    // Verificar se não está mais na lista de agentes
    cy.url().should('not.include', '/agents');
    
    // Verificar se está em uma página de agente específico
    cy.url().should('match', /\/agent\/\d+/);
    
    // Verificar se a página carregou completamente
    cy.get('body').should('not.contain', 'loading');
    
    cy.log('✅ Página do agente validada com sucesso');
    return this;
  }

  // Retorna para a página principal (dashboard)
  retornarParaPaginaPrincipal() {
    cy.log('🏠 Retornando para página principal...');
    
    // Clicar no logo ou navegar para dashboard
    cy.get('[data-testid="logo"], .logo, a[href*="dashboard"]').first().click();
    
    // Ou navegar diretamente
    cy.visit('/dashboard', { timeout: 30000 });
    
    // Aguardar dashboard carregar
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Retornou para página principal com sucesso');
    return this;
  }

  // Exibe resumo dos dados capturados
  exibirResumoDados() {
    cy.log('📋 Exibindo resumo dos dados capturados...');
    
    cy.window().then((win) => {
      if (win.dadosAgenteAcessado) {
        const dados = win.dadosAgenteAcessado;
        cy.log('📊 === RESUMO DOS DADOS DO AGENTE ===');
        cy.log(`📝 Nome: ${dados.nome || 'Não capturado'}`);
        cy.log(`📄 Descrição: ${dados.descricao || 'Não capturada'}`);
        cy.log(`🔗 URL: ${dados.url || 'Não capturada'}`);
        cy.log(`⏰ Timestamp: ${dados.timestamp || 'Não capturado'}`);
        cy.log('📊 === FIM DO RESUMO ===');
      } else {
        cy.log('⚠️ Nenhum dado foi capturado do agente');
      }
    });
    
    return this;
  }
}