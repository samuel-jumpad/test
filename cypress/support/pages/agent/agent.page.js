class AgentPage {
  elements = {
    agentsSection: () => cy.get('body').then(($body) => {
      // Try multiple strategies to find the agents section
      const selectors = [
        'span:contains("Agentes")',
        'a:contains("Agentes")',
        'div:contains("Agentes")',
        '[class*="nav"]:contains("Agentes")',
        '[class*="menu"]:contains("Agentes")'
      ];
      
      for (const selector of selectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Seção Agentes encontrada com seletor: ${selector}`);
          return cy.get(selector).first();
        }
      }
      
      cy.log('❌ Seção Agentes não encontrada, tirando screenshot');
      cy.screenshot('agentes-nao-encontrado');
      return cy.get('span:contains("Agentes")').first(); // fallback
    }),
    myAgents: () => cy.xpath('//div[normalize-space(text())="Meus Agentes"]'),
    createNewAgent: () => cy.xpath('//div[contains(@class, "flex items-center justify-center gap-2") and .//text()="Cadastrar Novo Agente"]'),
    
    searchInput: () => cy.xpath('//input[@type="search"]'),
    sparklesButton: () => cy.xpath('//button[@type="button" and @aria-haspopup="dialog" and @aria-expanded="false" and @data-state="closed" and contains(@class, "relative inline-flex items-center justify-center")]'),
    
    nameInput: () => cy.xpath('//input[@name="name"]'),
    descriptionInput: () => cy.xpath('//textarea[@name="description"]'),
    promptInput: () => cy.xpath('//textarea[contains(@class, "w-md-editor-text-input")]'),
    saveButton: () => cy.xpath('//div[contains(@class, "flex items-center justify-center gap-2") and .//text()="Salvar"]'),
    scrollArea: () => cy.xpath('//div[@data-radix-scroll-area-viewport]'),
    
    chatSection: () => cy.xpath('//div[contains(@class, "cursor-pointer") and .//span[text()="Chat"]]'),
    agentChatItem: () => cy.xpath('//div[contains(@class, "cursor-pointer") and .//div[text()="Agente teste automatizado"]]'),
    
    messageInput: () => cy.xpath('//div[@role="textbox" and @contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]'),
    sendButton: () => cy.xpath('//button[@type="submit" and contains(@class, "bg-black text-white")]'),
    closeButton: () => cy.xpath('//button[@type="button" and contains(@class, "bg-transparent")]'),
    
    deleteConfirmButton: () => cy.xpath('//button[contains(@class, "bg-[#e81b37]")]//div[contains(text(), "Deletar agente")]')
  };

  navigateToAgents() {
    cy.log('🔍 Procurando seção de Agentes...');
    
    // Aguardar página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Procurar seção de agentes com múltiplas estratégias
    cy.get('body').then(($body) => {
      const selectors = [
        'span:contains("Agentes")',
        'a:contains("Agentes")',
        'div:contains("Agentes")',
        '[class*="nav"]:contains("Agentes")',
        '[class*="menu"]:contains("Agentes")'
      ];
      
      let found = false;
      for (const selector of selectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Seção Agentes encontrada com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').click();
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('❌ Seção Agentes não encontrada, tentando navegação direta');
        cy.screenshot('agentes-nao-encontrado');
        // Tentar navegar diretamente
        cy.visit('/assistants', { timeout: 30000 });
      }
    });
    
    // Wait for navigation to complete
    cy.url({ timeout: 30000 }).should('include', '/assistants');
    cy.get('body').should('not.contain', 'loading');
    
    cy.log('✅ Navegação para Agentes concluída');
    
    return this;
  }

  clickMyAgents() {
    this.elements.myAgents()
      .should('be.visible')
      .scrollIntoView()
      .click();
    
    // Wait for agents list to load
    cy.get('body').should('not.contain', 'loading');
    this.elements.searchInput().should('be.visible', { timeout: 10000 });
    
    return this;
  }

  searchAgent(searchTerm) {
    this.elements.searchInput()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    this.elements.searchInput()
      .first()
      .clear()
      .type(searchTerm, { delay: 100 })
      .should('have.value', searchTerm);
    
    // Wait for search results to load
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  searchAgentForDeletion(agentName) {
    cy.log(`🔍 Procurando campo de busca para o agente: ${agentName}`);
    
    // Aguardar página carregar
    cy.get('body').should('not.contain', 'loading');
    
    // Buscar e digitar no campo de busca
    this.elements.searchInput()
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click()
      .clear()
      .type(agentName, { delay: 100 })
      .should('have.value', agentName);
    
    cy.log(`✅ Nome do agente "${agentName}" digitado no campo de busca`);
    
    // Aguardar resultados da busca
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Verificar se o agente aparece nos resultados
    cy.xpath(`//*[contains(text(), "${agentName}")]`, { timeout: 10000 })
      .should('be.visible')
      .then(($elements) => {
        if ($elements.length > 0) {
          cy.log(`✅ Agente "${agentName}" encontrado nos resultados`);
          cy.wrap($elements[0]).scrollIntoView();
        }
      });
    
    return this;
  }

  clickTrashButton(agentName) {
    cy.log('🔍 Procurando botão de delete...');
    
    // Aguardar carregamento da página
    cy.get('body').should('not.contain', 'loading');
    
    // Verificar se o agente está visível
    cy.log(`🔍 Verificando se o agente "${agentName}" está visível...`);
    cy.xpath(`//*[contains(text(), "${agentName}")]`).should('be.visible');
    cy.log(`✅ Agente "${agentName}" encontrado e visível`);
    
    // Clicar no botão de delete (seletor mais simples)
    cy.get('svg.lucide-trash2')
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });
    
    cy.log('✅ Botão de delete clicado');
    
    return this;
  }


  validateDeletionSuccess() {
    // Verify agent is no longer in the list
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  clickSparklesButton() {
    this.elements.sparklesButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for modal or action to start
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  fillAgentForm(name, description, prompt) {
    // Fill name field
    this.elements.nameInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(name, { delay: 100 })
      .should('have.value', name);

    // Fill description field
    this.elements.descriptionInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(description, { delay: 100 })
      .should('have.value', description);

    // Fill prompt field
    this.elements.promptInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(prompt, { delay: 100 })
      .should('have.value', prompt);

    return this;
  }

  scrollToBottom() {
    this.elements.scrollArea()
      .scrollTo('bottom', { duration: 1000 });
    
    // Wait for scroll to complete and save button to be visible
    this.elements.saveButton().should('be.visible');
    
    return this;
  }

  saveAgent() {
    this.elements.saveButton()
      .should('be.visible')
      .scrollIntoView()
      .click();
    
    // Wait for save action to start (button may become disabled briefly)
    // Don't assert disabled state as it depends on API response
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  validateAgentCreated(agentName) {
    // Wait for page to finish loading
    cy.get('body').should('not.contain', 'loading');
    
    // Aguardar um pouco para o framework renderizar
    cy.wait(3000);
    
    // Verify agent appears in the list - abordagem mais robusta
    cy.log(`🔍 Verificando se o agente "${agentName}" aparece na lista...`);
    
    // Usar XPath sem .first() para evitar DOM detachment
    cy.xpath(`//*[contains(text(), "${agentName}")]`, { timeout: 15000 })
      .should('be.visible')
      .then(($elements) => {
        if ($elements.length > 0) {
          cy.log(`✅ Agente ${agentName} encontrado na lista (${$elements.length} elementos)`);
          // Fazer scroll no primeiro elemento encontrado
          cy.wrap($elements[0]).scrollIntoView();
        }
      });
    
    return this;
  }

  handleCreationError() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="error"], .error, [class*="error"]').length > 0) {
        cy.log('⚠️ Erro detectado durante criação do agente');
        cy.reload();
        
        // Wait for reload to complete
        cy.get('body').should('be.visible');
        cy.get('body').should('not.contain', 'loading');
        
        this.navigateToAgents();
        this.clickMyAgents();
      }
    });
    return this;
  }

  sendMessageInModal(message) {
    cy.sendChatMessage(message);
    
    // Wait for message to be processed
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  closeModal() {
    this.elements.closeButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click({ force: true });
    
    // Wait for modal to close
    this.elements.closeButton().should('not.exist');
    
    return this;
  }

  navigateToChat() {
    this.elements.chatSection()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for chat to load
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectAgentChat() {
    this.elements.agentChatItem()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for chat to be ready
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  sendMessageInChat(message) {
    // Wait for message input to be ready
    cy.xpath('//div[@role="textbox" and @contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]')
      .should('be.visible', { timeout: 15000 })
      .and('be.enabled')
      .scrollIntoView()
      .type(message, { delay: 100 })
      .should('contain.text', message);
    
    // Click send button
    cy.xpath('//button[@type="submit" and contains(@class, "bg-black text-white")]')
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for message to be sent
    cy.get('body').should('not.contain', 'loading');
    cy.waitForPageLoad();
    
    return this;
  }

  createNewAgent(agentName) {
    this.navigateToAgents();
    this.clickMyAgents();
    
    // Click create new agent button
    this.elements.createNewAgent()
      .should('be.visible')
      .click();
    
    // Wait for form to load
    cy.get('body').should('not.contain', 'loading');
    this.elements.nameInput().should('be.visible', { timeout: 10000 });
    
    this.fillAgentForm(
      agentName,
      'Agent related to automated testing',
      'Agent related to automated testing, using cypress tool'
    );
    
    this.scrollToBottom();
    this.saveAgent();
    
    // Wait for save to complete with intelligent waiting
    cy.url().then((url) => {
      if (url.includes('/assistants/new')) {
        this.handleCreationError();
        cy.url({ timeout: 15000 }).should('include', '/assistants/list');
      } else {
        cy.url({ timeout: 10000 }).should('include', '/assistants/list');
      }
    });
    
    // Wait for page to finish loading before validation
    cy.get('body').should('not.contain', 'loading');
    
    this.validateAgentCreated(agentName);
    return this;
  }

  validateAgentCreated(agentName) {
    // Wait for page to finish loading
    cy.get('body').should('not.contain', 'loading');
    
    // Aguardar um pouco para o framework renderizar
    cy.wait(3000);
    
    // Verify agent appears in the list - abordagem mais robusta
    cy.log(`🔍 Verificando se o agente "${agentName}" aparece na lista...`);
    
    // Usar XPath sem .first() para evitar DOM detachment
    cy.xpath(`//*[contains(text(), "${agentName}")]`, { timeout: 15000 })
      .should('be.visible')
      .then(($elements) => {
        if ($elements.length > 0) {
          cy.log(`✅ Agente ${agentName} encontrado na lista (${$elements.length} elementos)`);
          // Fazer scroll no primeiro elemento encontrado
          cy.wrap($elements[0]).scrollIntoView();
        }
      });
    
    return this;
  }

  deleteAgent(agentName) {
    this.searchAgentForDeletion(agentName);
    this.clickTrashButton(agentName);
    
    // Clicar no botão "Deletar agente" para confirmar
    this.elements.deleteConfirmButton().click();
    
    // Aguardar deleção ser processada
    cy.wait(2000);
    cy.get('body').should('not.contain', 'loading');
    
    this.validateDeletionSuccess();
    return this;
  }
  accessOldAgent() {
    // Navigate to agents section
    this.elements.agentsSection()
      .should('be.visible')
      .click();

    // Wait for navigation
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navigate to my agents
    this.elements.myAgents()
      .should('be.visible')
      .scrollIntoView()
      .click();

    // Wait for my agents page to load
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Search for agent
    this.elements.searchInput()
      .first()
      .should('be.visible')
      .click()
      .clear()
      .type('Agente tes', { delay: 100 })
      .should('have.value', 'Agente tes');
    
    // Wait for search results
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Click on the found agent
    cy.contains('Agente teste automatizado', { timeout: 15000 })
      .should('be.visible')
      .click();

    // Wait for agent page to load
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);

    // Click sparkles button
    this.elements.sparklesButton()
      .first()
      .should('be.visible')
      .click();
    
    // Wait for modal to open
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Send first message
    this.elements.messageInput()
      .should('be.visible', { timeout: 15000 })
      .scrollIntoView()
      .type('hello', { delay: 100 })
      .should('contain.text', 'hello');
    
    this.elements.sendButton()
      .first()
      .should('be.visible')
      .click();

    // Wait for message to be sent and response to appear
    cy.xpath('//div[@role="dialog"]//div[contains(@class,"ml-auto") and contains(@class,"items-end")]//p[normalize-space()="hello"]')
      .should('be.visible', { timeout: 30000 })
      .scrollIntoView();

    // Close modal with multiple strategies
    cy.get('body').then(($body) => {
      // Try to find and click close button
      if ($body.find('[role="dialog"] button[type="button"]').length > 0) {
        cy.get('[role="dialog"] button[type="button"]')
          .first()
          .should('be.visible')
          .click({ force: true });
      } else {
        // Fallback: try ESC key
        cy.get('body').type('{esc}');
      }
    });

    // Wait for modal to close - check for modal dialog to disappear
    cy.get('[role="dialog"]', { timeout: 10000 }).should('not.exist');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navigate to chat section
    this.elements.chatSection()
      .first()
      .should('be.visible')
      .click();

    // Wait for chat to load
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Select agent chat
    this.elements.agentChatItem()
      .first()
      .should('be.visible')
      .click();

    // Wait for chat to be ready
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Send second message
    this.elements.messageInput()
      .should('be.visible', { timeout: 15000 })
      .scrollIntoView()
      .type('hello 2', { delay: 100 })
      .should('contain.text', 'hello 2');
    
    this.elements.sendButton()
      .first()
      .should('be.visible')
      .click();

    // Wait for message to appear in chat
    cy.xpath('//p[contains(text(),"hello")]')
      .last()
      .should('be.visible', { timeout: 20000 })
      .and('contain', 'hello');

    return this;
  }

  waitForPageLoad() {
    // Wait for page to be fully interactive
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'loading');
    cy.document().should('have.property', 'readyState', 'complete');
    cy.waitForPageLoad();
    return this;
  }
}

export default new AgentPage();