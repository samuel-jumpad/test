class ChatPage {
  elements = {
    chatSection: () => cy.xpath('//div[@class="flex-1 overflow-hidden transition-opacity duration-300 ease-in-out text-ellipsis opacity-100"]//span[contains(text(), "Chat")]'),
    generalChat: () => cy.get('div').contains('Geral'),
    chatItem: () => cy.get('div.flex-1.truncate'),
    messageBubble: () => cy.xpath('//div[@class="p-2 border rounded-xl bg-gray-100"]')
  };

  openChatSection() {
    this.elements.chatSection()
      .should('be.visible')
      .click();
    
    // Wait for chat section to load
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectGeneralChat() {
    this.elements.generalChat()
      .should('be.visible')
      .click();
    
    // Wait for general chat to be selected
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectFirstChatItem() {
    this.elements.chatItem()
      .first()
      .should('be.visible')
      .click();
    
    // Wait for chat item to be selected
    cy.get('body').should('not.contain', 'loading');
    
    // Additional wait before proceeding to message input
    cy.wait(2000);
    
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
    // Wait for chat interface to be ready
    cy.get('body').should('not.contain', 'loading');
    
    // Send message using the command (which handles input validation)
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
    
    // Wait for specific loading states to disappear (but ignore data-loading attributes on buttons)
    cy.get('[data-testid="loading"], .loading').should('not.exist');
    
    return this;
  }
}

export default new ChatPage();