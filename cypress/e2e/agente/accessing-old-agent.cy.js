import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('m.target?.contains is not a function') ||
      err.message.includes('contains is not a function') ||
      err.message.includes('Cannot read properties of undefined')) {
    console.log('⚠️ Ignorando erro de aplicação:', err.message);
    return false;
  }
  return true;
});

describe("Agentes - Acessando Agente Antigo", () => {
  const agentPage = new AgentPage();

  beforeEach(() => {
    cy.setupTest();
  });

  it("deve acessar agente antigo e enviar mensagem no chat", () => {
    cy.log('🚀 Iniciando teste de acesso ao agente antigo e envio de mensagem...');
    
    agentPage.fluxoCompletoTesteAgenteAntigo();
    
    cy.log('🎉 Teste concluído com sucesso!');
  });
});