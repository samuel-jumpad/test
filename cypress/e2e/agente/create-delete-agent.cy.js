import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Agente - Criar e Deletar", () => {
  const loginPage = new LoginPage();
  const agentPage = new AgentPage();
  const agentName = "Agente Teste";

  it("deve criar e deletar um agente com sucesso", () => {
    // ===== LOGIN =====
    cy.log('🔐 Realizando login...');
    cy.visit("/", { timeout: 30000 });
    
    loginPage.fazerLogin();
    
    // Confirma que foi para o dashboard
    cy.url({ timeout: 30000 }).should("include", "/dashboard");
    cy.xpath('//h4[contains(text(), "Boas vindas")]').should("be.visible");

    // ===== NAVEGAÇÃO PARA AGENTES =====
    cy.log('🧭 Navegando para página de agentes...');
    agentPage.navegarParaAgentes();

    // ===== CRIAÇÃO DO AGENTE =====
    cy.log('🤖 Criando novo agente...');
    agentPage.criarNovoAgente(agentName);

    // ===== DELEÇÃO DO AGENTE =====
    cy.log('🗑️ Deletando agente...');
    agentPage.deletarAgente(agentName);

    cy.log('✅ Teste concluído com sucesso!');
  });
});