import { LoginPage } from "../../support/pages/login/login.page.js";
import { ChatPage } from "../../support/pages/chat/chat.page.js";

describe("Chat - Teste Completo", () => {
  const loginPage = new LoginPage();
  const chatPage = new ChatPage();
  const mensagem = "ola, como vai?";

  it("deve fazer login completo e enviar mensagem no chat", () => {
    cy.log('🚀 Iniciando teste completo de login e chat...');


    cy.log('📋 Fase 1: Realizando login...');
    cy.visit("/", { timeout: 30000 });
    
    loginPage.fazerLogin();

    cy.url({ timeout: 30000 }).should("include", "/dashboard");
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').should('be.visible');
    cy.log('✅ Login realizado com sucesso');

    cy.log('📋 Fase 2: Executando fluxo de chat...');
    chatPage.fluxoCompletoChat(mensagem);

    cy.log('✅ Teste de envio de mensagem concluído com sucesso!');
  });
});