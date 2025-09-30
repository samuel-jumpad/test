// ===== PÁGINA DE AGENTE =====

export class AgentPage {
  
  // ===== FUNÇÕES DE NAVEGAÇÃO =====
  
  // Navega para a página de agentes via dashboard
  navegarParaAgentes() {
    cy.log('🔍 Navegando para página de Agentes...');
    
    // Clica no menu Agentes
    cy.xpath('//span[normalize-space(text())="Agentes"]').click();
    cy.contains("Explore e desenvolva versões únicas de agentes").should('be.visible');

    // Clica em "Meus Agentes"
    cy.xpath('//button//div[contains(text(), "Meus Agentes")]')
      .should('be.visible')
      .click();
    
    cy.log('✅ Navegação para Agentes concluída');
  }

  // ===== FUNÇÕES DE CRIAÇÃO =====

  // Função principal para criar um novo agente
  criarNovoAgente(agentName, description = 'Relacionado a teste automatizado') {
    cy.log(`🤖 Criando novo agente: ${agentName}`);
    
    // Clicar no botão "Cadastrar Novo Agente"
    cy.xpath('//div[contains(@class, "flex items-center justify-center gap-2") and .//text()="Cadastrar Novo Agente"]')
      .should('be.visible')
      .click();

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
}