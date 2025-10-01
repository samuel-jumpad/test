import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Chat - Teste Completo", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();
  const mensagem = "ola, como vai?";

  it("deve fazer login completo e enviar mensagem no chat", () => {
    cy.log('🚀 Starting complete login and chat test...');
    cy.log('📋 Phase 1: Performing login...');
    cy.visit("/", { timeout: 30000 });
    loginPage.fazerLogin();
    cy.url({ timeout: 30000 }).should("include", "/dashboard");
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').should('be.visible');
    cy.log('✅ Login completed successfully');
    cy.log('📋 Phase 2: Executing chat flow...');
    chatPage.fluxoCompletoChat(mensagem);
    cy.log('✅ Message sending test completed successfully!');
  });
});