import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";
import ChatPage from "../../support/pages/chat/chat.page.js";

describe("Agentes - Acessando Agente Antigo", () => {
  const agentPage = new AgentPage();
  const chatPage = ChatPage;

  beforeEach(() => {
    cy.setupTest();
  });

  it("deve acessar agente antigo e enviar mensagem no chat", () => {
    cy.log('🚀 Iniciando teste de acesso ao agente antigo e envio de mensagem...');

    // ===== FASE 1: ACESSAR AGENTE =====
    cy.log('📋 Fase 1: Acessando agente antigo...');
    agentPage.executarFluxoCompletoAcessoAgente('Agente teste automatizado');

    // ===== FASE 2: TESTAR AGENTE =====
    cy.log('📋 Fase 2: Testando agente...');
    chatPage
      .findAndClickTestButton()
      .captureAgentData();

    // ===== FASE 3: ENVIAR MENSAGEM =====
    cy.log('📋 Fase 3: Enviando mensagem no chat...');
    chatPage
      .sendMessageToAgent('Olá! Este é um teste automatizado do Cypress. Como você está?')
      .validateMessageSent();

    // ===== FASE 4: VALIDAÇÃO FINAL =====
    cy.log('📋 Fase 4: Validação final...');
    agentPage.exibirResumoDados();

    // ===== RESUMO DE SUCESSO =====
    cy.log('🎉 Teste concluído com sucesso!');
    cy.log('✅ Login realizado');
    cy.log('✅ Agente encontrado e acessado');
    cy.log('✅ Botão testar clicado');
    cy.log('✅ Dados capturados');
    cy.log('✅ Mensagem enviada no chat');
    cy.log('✅ Validações realizadas');
  });
});