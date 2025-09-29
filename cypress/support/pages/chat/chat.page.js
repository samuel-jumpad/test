class ChatPage {
  elements = {
    chatSection: () => cy.xpath('//div[contains(@class, "flex-1 overflow-hidden") and contains(@class, "text-ellipsis")]'),
    generalChat: () => cy.xpath('//div[contains(@class, "truncate flex items-center gap-1") and .//div[text()="Geral"]]'),
    chatItem: () => cy.xpath('//div[contains(@class, "truncate flex items-center gap-1")]'),
    messageBubble: () => cy.xpath('//div[@class="p-2 border rounded-xl bg-gray-100"]')
  };

  openChatSection() {
    this.elements.chatSection()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for chat section to load
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectGeneralChat() {
    this.elements.generalChat()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for general chat to be selected
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectFirstChatItem() {
    this.elements.chatItem()
      .first()
      .should('be.visible')
      .and('be.enabled')
      .click();
    
    // Wait for chat item to be selected
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  validateMessageSent() {
    // Wait for message to appear in chat
    this.elements.messageBubble()
      .should('be.visible', { timeout: 15000 });
    
    // Ensure chat is not in loading state
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  sendMessageInChat(message) {
    // Open chat section and wait for it to be ready
    this.openChatSection();
    
    // Select general chat and wait for it to be ready
    this.selectGeneralChat();
    
    // Select first chat item and wait for it to be ready
    this.selectFirstChatItem();
    
    // Wait for message input to be available
    cy.get('div[role="textbox"][contenteditable="true"][data-placeholder="Digite aqui sua mensagem..."]')
      .should('be.visible', { timeout: 15000 })
      .and('be.enabled');
    
    // Send message
    cy.sendChatMessage(message);
    
    // Wait for page to be ready
    cy.waitForPageLoad();
    
    // Validate message was sent
    this.validateMessageSent();
    
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

export default new ChatPage();