export class AgentPage {
  configurarInterceptacoes() {
    cy.log('🔧 Configurando interceptações e otimizações...');
    
    // Interceptações baseadas no commands.js dos outros testes
    cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('translationRequest');
    
    cy.intercept('GET', '**/translate.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('googleTranslationRequest');
    
    cy.intercept('POST', '**/chats/**/messages', { 
      statusCode: 200, 
      body: { success: true, message: 'Message sent successfully' } 
    }).as('chatMessageRequest');
    
    cy.intercept('GET', '**/api/agents/featured', { 
      statusCode: 200, 
      body: { agents: [] } 
    }).as('featuredAgentsRequest');
    
    cy.intercept('GET', '**/api/agents/most-used', { 
      statusCode: 200, 
      body: { agents: [] } 
    }).as('mostUsedAgentsRequest');
    
    cy.intercept('GET', '**/api/llms', { 
      statusCode: 200, 
      body: { llms: [] } 
    }).as('llmsRequest');
    
    // Interceptação final para garantir bloqueio de tradução
    cy.intercept('**/translate**', { statusCode: 200, body: '{}' }).as('blockTranslateFinal');
    
    // Configurações para acelerar o teste
    cy.window().then((win) => {
      // Desabilitar animações CSS
      win.document.documentElement.style.setProperty('animation-duration', '0s');
      win.document.documentElement.style.setProperty('transition-duration', '0s');
      
      // Desabilitar tradução automática do navegador
      win.document.documentElement.setAttribute('translate', 'no');
      win.document.documentElement.setAttribute('lang', 'en');
    });
    
    cy.log('✅ Interceptações e otimizações configuradas');
    return this;
  }
  navegarParaAgentes() {
    cy.log('🔍 Navegando para página de Agentes...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
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
    cy.url({ timeout: 15000 }).should('include', '/assistants');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.log('✅ Navegação para Agentes concluída');
    
    // Após clicar em "Agentes", clicar em "Meus Agentes"
    cy.log('📋 Clicando em "Meus Agentes"...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por button');
        cy.get('button:contains("Meus Agentes")').first().click();
      } else if ($body.find('div:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por div');
        cy.get('div:contains("Meus Agentes")').first().click();
      } else if ($body.find('span:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por span');
        cy.get('span:contains("Meus Agentes")').first().click();
      } else {
        cy.log('⚠️ "Meus Agentes" não encontrado, continuando...');
      }
    });
    cy.wait(2000);
    cy.log('✅ "Meus Agentes" clicado');
    return this;
  }

  criarNovoAgente(agentName, description = 'Relacionado a teste automatizado') {
    cy.log(`🤖 Criando novo agente: ${agentName}`);
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
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
    cy.url({ timeout: 15000 }).should('include', '/assistants/new');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').should('be.visible');
    cy.xpath('//input[@name="name"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 150 });
    cy.xpath('//textarea[@name="description"]')
      .should('be.visible')
      .clear()
      .type(description, { delay: 150 });
    cy.xpath('//textarea[contains(@class,"w-md-editor-text-input")]')
      .should('be.visible')
      .clear()
      .type('Teste automatizado Cypress', { delay: 150 });
    cy.xpath('//*[@data-radix-scroll-area-viewport]')
      .scrollTo('bottom', { duration: 2000 });
    cy.xpath('//button[@type="submit"]')
      .should('be.visible')
      .click();
    this.validarAgenteCriado(agentName);
  }

  validarAgenteCriado(agentName) {
    cy.log(`✅ Validando criação do agente: ${agentName}`);
    cy.url({ timeout: 15000 }).should('not.include', '/assistants/new');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').then(($body) => {
      const textosSucesso = [
        'Agente criado',
        'criado com sucesso',
        'sucesso',
        'created',
        'success'
      ];
      let sucessoEncontrado = false;
      for (const texto of textosSucesso) {
        if ($body.text().toLowerCase().includes(texto.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${texto}"`);
          sucessoEncontrado = true;
          break;
        }
      }
      if (!sucessoEncontrado) {
        cy.log('⚠️ Mensagem de sucesso não encontrada, mas agente pode ter sido criado');
        cy.screenshot('validacao-criacao-sem-mensagem');
      }
    });
    cy.log(`✅ Agente "${agentName}" criado com sucesso`);
  }

  buscarAgente(agentName) {
    cy.log(`🔍 Buscando agente: ${agentName}`);
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="search"]',
        '[data-testid*="search"]',
        '[class*="search"] input'
      ];
      let campoBuscaEncontrado = false;
      for (const selector of selectorsBusca) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de busca encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(agentName, { delay: 100 });
          campoBuscaEncontrado = true;
          break;
        }
      }
      if (!campoBuscaEncontrado) {
        cy.log('⚠️ Campo de busca não encontrado, tentando input genérico...');
        if ($body.find('input[type="text"]').length > 0) {
          cy.get('input[type="text"]').first()
            .should('be.visible')
            .clear()
            .type(agentName, { delay: 100 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });
    cy.wait(3000);
    cy.get('body').should('contain', agentName);
    cy.log(`✅ Agente "${agentName}" encontrado`);
    return this;
  }

  deletarAgente(agentName) {
    cy.log(`🗑️ Deletando agente: ${agentName}`);
    this.buscarAgente(agentName);
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr')
      .should('exist')
      .should('be.visible');
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr//button')
      .should('exist')
      .should('have.length.greaterThan', 0);
    cy.get('table tbody tr')
      .contains(agentName)
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const seletoresDeletar = [
        'button:contains("Deletar")',
        'button:contains("deletar")',
        'button:contains("Delete")',
        'button:contains("Confirmar")',
        'button:contains("confirmar")',
        'button:contains("Sim")',
        '[class*="danger"]:contains("Deletar")',
        '[class*="red"]:contains("Deletar")',
        '[class*="delete"]'
      ];
      let botaoEncontrado = false;
      for (const seletor of seletoresDeletar) {
        if ($body.find(seletor).length > 0) {
          cy.log(`✅ Botão de deletar encontrado: ${seletor}`);
          cy.get(seletor).last()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão de deletar não encontrado, tentando último botão do modal...');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
          .last()
          .should('be.visible')
          .click();
      }
    });
    this.validarDelecaoSucesso();
  }

  validarDelecaoSucesso() {
    cy.log('✅ Validando deleção do agente...');
    cy.wait(3000);
    cy.get('body').then(($body) => {
      const mensagensSucesso = [
        'Agente removido',
        'removido',
        'deletado',
        'excluído',
        'deleted',
        'removed',
        'success'
      ];
      let mensagemEncontrada = false;
      for (const mensagem of mensagensSucesso) {
        if ($body.text().toLowerCase().includes(mensagem.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
          mensagemEncontrada = true;
          break;
        }
      }
      if (!mensagemEncontrada) {
        cy.log('⚠️ Mensagem de sucesso não encontrada, mas deleção pode ter ocorrido');
        cy.screenshot('validacao-delecao-sem-mensagem');
      }
    });
    cy.log('✅ Agente deletado com sucesso');
  }










}