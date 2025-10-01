import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Agente - Criar e Deletar", () => {
  const loginPage = new LoginPage();
  const agentPage = new AgentPage();
  const agentName = "Agente Teste";

  it("deve criar e deletar um agente com sucesso", () => {
    cy.log('🔐 Realizando login...');
    cy.visit("/", { timeout: 30000 });
    loginPage.fazerLogin();
    cy.url({ timeout: 30000 }).should("include", "/dashboard");
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').should('be.visible');
    cy.log('🧭 Navegando para página de agentes...');
    agentPage.navegarParaAgentes();
    cy.log('🤖 Criando novo agente...');
    agentPage.criarNovoAgente(agentName);
    cy.log('🗑️ Deletando agente...');
    agentPage.deletarAgente(agentName);
    cy.log('✅ Teste concluído com sucesso!');
  });
});