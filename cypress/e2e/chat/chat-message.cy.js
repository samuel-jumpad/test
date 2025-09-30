import { LoginPage } from '../../support/pages/login/login.page.js';
import ChatPage from '../../support/pages/chat/chat.page.js';

describe('Chat - Send Message in Old Conversation', () => {
  beforeEach(() => {
    cy.setupTestForChat();
  });

  it('should send message in existing chat conversation', () => {
    // Wait for dashboard to be fully loaded after login
    cy.get('body').should('not.contain', 'loading');
    
    // Verify we're on dashboard
    cy.url().should('include', '/dashboard');
    
    // Use ChatPage methods to navigate and send message
    ChatPage
      .openChatSection()                    // Click on Chat section
      .selectGeneralChat()                  // Click on "Geral" folder
      .selectFirstChatItem()                // Click on first conversation
      .sendMessageInChat('O dia esta lindo') // Send message (includes verification)
      .waitForPageLoad();                   // Wait for completion
    
    // Additional wait to ensure everything is stable
    cy.wait(2000);
  });

});