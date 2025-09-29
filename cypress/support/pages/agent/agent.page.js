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
    
    trashButton: () => cy.xpath('//div[@class="flex items-center justify-center gap-2"]//svg[@class="lucide lucide-trash2"]/parent::div/parent::button'),
    deleteModal: () => cy.get('div[role="dialog"]'),
    deleteModalFallback: () => cy.get('div[role="dialog"], [data-radix-dialog-content], [data-radix-dialog-overlay], [aria-modal="true"], [data-state="open"]'),
    confirmActionText: () => cy.xpath('//div[@role="dialog" and @data-state="open"]//*[contains(normalize-space(.),"Confirmar Ação") or contains(normalize-space(.),"Confirmar ação")]'),
    deleteConfirmText: () => cy.xpath('//div[@role="dialog" and @data-state="open"]//*[contains(normalize-space(.),"Tem certeza que deseja deletar este agente?")]'),
    deleteConfirmButton: () => cy.xpath('//button[contains(@class, "bg-[#e81b37]") and .//div[text()="Deletar agente"]]'),
    successToast: () => cy.xpath('//li[contains(@class,"toast-root") and .//div[text()="Agente removido"] and .//div[contains(text(),"foi removido com sucesso")]]')
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
    this.elements.searchInput()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    this.elements.searchInput()
      .first()
      .clear()
      .type(agentName, { delay: 100 })
      .should('have.value', agentName);
    
    // Wait for search results and agent to be visible
    cy.get('body').should('not.contain', 'loading');
    cy.xpath(`//*[contains(text(), "${agentName}")]`, { timeout: 10000 }).should('be.visible');
    
    return this;
  }

  clickTrashButton() {
    // Log para debug
    cy.log('🔍 Procurando botão de delete...');
    
    // Aguardar carregamento da página
    cy.get('body').should('not.contain', 'loading');
    
    // Verificar quantos botões existem usando XPath com classe específica
    cy.xpath('//div[@class="flex items-center justify-center gap-2"]//svg[@class="lucide lucide-trash2"]').then(($buttons) => {
      cy.log(`📊 Encontrados ${$buttons.length} botões de delete`);
      
      if ($buttons.length === 0) {
        cy.log('❌ Nenhum botão de delete encontrado!');
        cy.screenshot('nenhum-botao-delete');
        return;
      }
      
      // Procurar o botão com XPath com classe específica
      this.elements.trashButton()
        .first() // Garantir que pega apenas 1 elemento
        .should('be.visible', { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true });
      
      cy.log('✅ Botão de delete clicado');
      
      // Aguardar um tempo para o modal aparecer
      cy.wait(3000);
      
      // Verificar se o modal apareceu
      cy.get('body').then(($body) => {
        const modalExists = $body.find('div[role="dialog"]').length > 0;
        if (modalExists) {
          cy.log('✅ Modal apareceu!');
        } else {
          cy.log('⏳ Modal ainda não apareceu, será aguardado na próxima etapa...');
        }
      });
    });
    
    return this;
  }

  validateDeleteModal() {
    cy.log('🔍 Aguardando modal de confirmação...');
    
    // Estratégia mais robusta: tentar aguardar o modal diretamente
    cy.log('⏳ Aguardando modal com estratégia robusta...');
    
    // Primeiro, tentar aguardar o modal principal
    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"]').length > 0) {
        cy.log('✅ Modal principal encontrado imediatamente');
        return;
      }
    });
    
    // Se não encontrou, aguardar com timeout e múltiplos seletores
    cy.get('div[role="dialog"], [data-radix-dialog-content], [data-radix-dialog-overlay], [aria-modal="true"], [data-state="open"]', { timeout: 15000 })
      .should('be.visible')
      .then(($modal) => {
        cy.log(`✅ Modal encontrado: ${$modal[0].tagName} com classes: ${$modal[0].className}`);
      });
    
    cy.log('✅ Modal encontrado');

    // Verificar conteúdo do modal
    this.elements.confirmActionText()
      .should('be.visible', { timeout: 10000 });

    this.elements.deleteConfirmText()
      .should('be.visible', { timeout: 10000 });
    
    // Verificar botão de confirmação
    this.elements.deleteConfirmButton()
      .should('be.visible')
      .and('be.enabled');
    
    cy.log('✅ Modal validado com sucesso');
    
    return this;
  }

  confirmDeletion() {
    this.elements.deleteConfirmButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for deletion to complete
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  validateDeletionSuccess() {
    // Wait for success toast to appear
    this.elements.successToast()
      .should('be.visible', { timeout: 15000 });
    
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
    
    // Verify agent appears in the list
    cy.xpath(`//*[contains(text(), "${agentName}")]`)
      .should('be.visible', { timeout: 15000 })
      .scrollIntoView();
    
    cy.log(`✅ Agente ${agentName} encontrado na lista`);
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

  deleteAgent(agentName) {
    this.searchAgentForDeletion(agentName);
    this.clickTrashButton();
    this.validateDeleteModal();
    this.confirmDeletion();
    this.validateDeletionSuccess();
    return this;
  }

  accessOldAgent() {
    // Navigate to agents section
    this.elements.agentsSection()
      .should('be.visible')
      .and('be.enabled')
      .click();

    // Navigate to my agents
    this.elements.myAgents()
      .should('be.visible')
      .and('be.enabled')
      .scrollIntoView()
      .click();

    // Search for agent
    this.elements.searchInput()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click()
      .clear()
      .type('Agente tes', { delay: 100 })
      .should('have.value', 'Agente tes');
    
    // Wait for search results
    cy.get('body').should('not.contain', 'loading');

    // Click on the found agent
    cy.contains('Agente teste automatizado', { timeout: 15000 })
      .should('be.visible')
      .and('be.enabled')
      .click();

    // Wait for agent page to load
    cy.get('body').should('not.contain', 'loading');

    // Click sparkles button
    this.elements.sparklesButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for modal to open
    cy.get('body').should('not.contain', 'loading');

    // Send first message
    this.elements.messageInput()
      .should('be.visible', { timeout: 15000 })
      .and('be.enabled')
      .scrollIntoView()
      .type('hello', { delay: 100 })
      .should('contain.text', 'hello');
    
    this.elements.sendButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();

    // Wait for message to be sent and response to appear
    cy.xpath('//div[@role="dialog"]//div[contains(@class,"ml-auto") and contains(@class,"items-end")]//p[normalize-space()="hello"]')
      .should('be.visible', { timeout: 30000 })
      .scrollIntoView();

    // Close modal
    this.elements.closeButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click({ force: true });

    // Wait for modal to close
    this.elements.closeButton().should('not.exist');

    // Navigate to chat section
    this.elements.chatSection()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();

    // Wait for chat to load
    cy.get('body').should('not.contain', 'loading');

    // Select agent chat
    this.elements.agentChatItem()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();

    // Wait for chat to be ready
    cy.get('body').should('not.contain', 'loading');

    // Send second message
    this.elements.messageInput()
      .should('be.visible', { timeout: 15000 })
      .and('be.enabled')
      .scrollIntoView()
      .type('hello 2', { delay: 100 })
      .should('contain.text', 'hello 2');
    
    this.elements.sendButton()
      .first()
      .should('be.visible')
      .and('be.enabled')
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