class ChatPage {
  elements = {
    chatSection: () => cy.xpath('//div[contains(@class, "flex-1 overflow-hidden") and contains(@class, "text-ellipsis")]'),
    generalChat: () => cy.xpath('//div[contains(@class, "truncate flex items-center gap-1") and .//div[text()="Geral"]]'),
    chatItem: () => cy.xpath('//div[contains(@class, "truncate flex items-center gap-1")]'),
    messageBubble: () => cy.xpath('//div[@class="p-2 border rounded-xl bg-gray-100"]')
  };

  openChatSection() {
    this.elements.chatSection().first().click();
    return this;
  }

  selectGeneralChat() {
    this.elements.generalChat().first().click();
    return this;
  }

  selectFirstChatItem() {
    this.elements.chatItem().first().click();
    return this;
  }

  validateMessageSent() {
    this.elements.messageBubble().should('be.visible');
    return this;
  }

  sendMessageInChat(message) {
    this.openChatSection();
    this.selectGeneralChat();
    this.selectFirstChatItem();
    cy.sendChatMessage(message);
    cy.waitForPageLoad();
    this.validateMessageSent();
    return this;
  }

  waitForPageLoad() {
    cy.waitForPageLoad();
    return this;
  }
}

export default new ChatPage();