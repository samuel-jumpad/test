class AgentPage {
  elements = {
    agentsSection: () => cy.xpath('//span[normalize-space(.)="Agentes"]'),
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
    
    trashButton: () => cy.get('button svg[class*="lucide-trash2"]').parent(),
    deleteModal: () => cy.xpath('//div[@role="dialog" and @data-state="open"]'),
    confirmActionText: () => cy.xpath('//div[@role="dialog" and @data-state="open"]//*[contains(normalize-space(.),"Confirmar Ação") or contains(normalize-space(.),"Confirmar ação")]'),
    deleteConfirmText: () => cy.xpath('//div[@role="dialog" and @data-state="open"]//*[contains(normalize-space(.),"Tem certeza que deseja deletar este agente?")]'),
    deleteConfirmButton: () => cy.xpath('//button[contains(@class, "bg-[#e81b37]") and .//div[text()="Deletar agente"]]'),
    successToast: () => cy.xpath('//li[contains(@class,"toast-root") and .//div[text()="Agente removido"] and .//div[contains(text(),"foi removido com sucesso")]]')
  };

  navigateToAgents() {
    this.elements.agentsSection()
      .should('be.visible')
      .click();
    return this;
  }

  clickMyAgents() {
    this.elements.myAgents()
      .should('be.visible')
      .scrollIntoView()
      .click();
    return this;
  }

  searchAgent(searchTerm) {
    this.elements.searchInput()
      .first()
      .click();
    
    this.elements.searchInput()
      .first()
      .type(searchTerm, { delay: 100 });
    return this;
  }

  searchAgentForDeletion(agentName) {
    this.elements.searchInput()
      .first()
      .click();
    
    this.elements.searchInput()
      .first()
      .type(agentName, { delay: 10 });
    
    this.elements.searchInput().should('have.value', agentName);
    return this;
  }

  clickTrashButton() {
    this.elements.trashButton()
      .first()
      .click();
    return this;
  }

  validateDeleteModal() {
    this.elements.deleteModal()
      .should('be.visible', { timeout: 10000 });

    this.elements.confirmActionText()
      .should('be.visible');

    this.elements.deleteConfirmText()
      .should('be.visible');
    
    return this;
  }

  confirmDeletion() {
    this.elements.deleteConfirmButton()
      .should('be.visible')
      .click();
    return this;
  }

  validateDeletionSuccess() {
    this.elements.successToast()
      .should('be.visible', { timeout: 10000 });
    return this;
  }

  clickSparklesButton() {
    this.elements.sparklesButton().first().click();
    return this;
  }

  fillAgentForm(name, description, prompt) {
    this.elements.nameInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(name, { delay: 100 });

    this.elements.descriptionInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(description, { delay: 100 });

    this.elements.promptInput()
      .should('be.visible')
      .scrollIntoView()
      .clear()
      .type(prompt, { delay: 100 });

    return this;
  }

  scrollToBottom() {
    this.elements.scrollArea()
      .scrollTo('bottom', { duration: 1000 });
    cy.wait(100);
    return this;
  }

  saveAgent() {
    this.elements.saveButton()
      .should('be.visible')
      .scrollIntoView()
      .click();
    return this;
  }

  validateAgentCreated(agentName) {
    cy.xpath(`//*[contains(text(), "${agentName}")]`)
      .should('be.visible', { timeout: 10000 })
      .scrollIntoView();
    
    cy.log(`✅ Agente ${agentName} encontrado na lista`);
    return this;
  }

  handleCreationError() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="error"], .error, [class*="error"]').length > 0) {
        cy.log('⚠️ Erro detectado durante criação do agente');
        cy.reload();
        this.navigateToAgents();
        this.clickMyAgents();
      }
    });
    return this;
  }

  sendMessageInModal(message) {
    cy.sendChatMessage(message);
    cy.wait(5000);
    return this;
  }

  closeModal() {
    this.elements.closeButton()
      .first()
      .click({ force: true });
    return this;
  }

  navigateToChat() {
    this.elements.chatSection()
      .first()
      .click();
    return this;
  }

  selectAgentChat() {
    this.elements.agentChatItem()
      .first()
      .click();
    return this;
  }

  sendMessageInChat(message) {
    cy.xpath('//div[@role="textbox" and @contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]')
      .should('be.visible', { timeout: 10000 })
      .scrollIntoView()
      .type(message, { delay: 100 });
    
    cy.xpath('//button[@type="submit" and contains(@class, "bg-black text-white")]')
      .first()
      .click();
    
    cy.waitForPageLoad();
    return this;
  }

  createNewAgent(agentName) {
    this.navigateToAgents();
    this.clickMyAgents();
    this.elements.createNewAgent()
      .should('be.visible')
      .click();
    
    this.fillAgentForm(
      agentName,
      'Agent related to automated testing',
      'Agent related to automated testing, using cypress tool'
    );
    
    this.scrollToBottom();
    this.saveAgent();
    
    cy.wait(3000);
    
    cy.url().then((url) => {
      if (url.includes('/assistants/new')) {
        this.handleCreationError();
        cy.wait(5000);
        cy.url().should('include', '/assistants/list', { timeout: 10000 });
      } else {
        cy.url().should('include', '/assistants/list', { timeout: 5000 });
      }
    });
    
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
    this.elements.agentsSection()
      .should('be.visible')
      .click();

    this.elements.myAgents()
      .should('be.visible')
      .scrollIntoView()
      .click();

    this.elements.searchInput()
      .first()
      .click()
      .type('Agente tes', { delay: 100 });
    
    cy.wait(3000);

    cy.contains('Agente teste automatizado', { timeout: 10000 })
      .should('be.visible')
      .click();

    this.elements.sparklesButton()
      .first()
      .click();
    
    cy.wait(1000);

    this.elements.messageInput()
      .should('be.visible', { timeout: 10000 })
      .scrollIntoView()
      .type('hello', { delay: 100 });
    
    this.elements.sendButton()
      .first()
      .click();

    cy.xpath('//div[@role="dialog"]//div[contains(@class,"ml-auto") and contains(@class,"items-end")]//p[normalize-space()="hello"]')
      .should('be.visible', { timeout: 100000 })
      .scrollIntoView();

    this.elements.closeButton()
      .first()
      .click({ force: true });

    this.elements.chatSection()
      .first()
      .click();

    this.elements.agentChatItem()
      .first()
      .click();

    this.elements.messageInput()
      .should('be.visible', { timeout: 10000 })
      .scrollIntoView()
      .type('hello 2', { delay: 100 });
    
    this.elements.sendButton()
      .first()
      .click();

    cy.xpath('//p[contains(text(),"hello")]')
      .last()
      .should('be.visible', { timeout: 10000 })
      .and('contain', 'hello');

    return this;
  }

  waitForPageLoad() {
    cy.waitForPageLoad();
    return this;
  }
}

export default new AgentPage();