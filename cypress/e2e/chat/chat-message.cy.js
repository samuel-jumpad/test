import LoginPage from '../../support/pages/login/login.page.js';
import ChatPage from '../../support/pages/chat/chat.page.js';

describe('Chat - Send Message in Old Conversation', () => {
  beforeEach(() => {
    cy.setupTest();
  });

  it('should send message in existing chat conversation', () => {
    ChatPage
      .sendMessageInChat('Ola')
      .waitForPageLoad();
  });

});