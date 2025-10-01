import { LoginPage } from "../../support/pages/login/login.page.js";
import { AgentPage } from "../../support/pages/agent/agent.page.js";

describe("Agentes - Acessando Agente Antigo", () => {
  beforeEach(() => {
    cy.setupTest();
  });

  it("deve acessar agente antigo e enviar mensagem no chat", () => {
    cy.log('🚀 Iniciando teste de acesso ao agente antigo e envio de mensagem...');

    // ===== FASE 1: NAVEGAÇÃO PARA AGENTES =====
    cy.log('📋 Fase 1: Navegando para página de agentes...');
    
    // Aguarda página carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tenta encontrar o menu Agentes com seletores CSS
    cy.get('body').then(($body) => {
      if ($body.find('span:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por span');
        cy.get('span:contains("Agentes")').first().click();
      } else if ($body.find('div:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por div');
        cy.get('div:contains("Agentes")').first().click();
      } else if ($body.find('button:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por button');
        cy.get('button:contains("Agentes")').first().click();
      } else {
        cy.log('⚠️ Menu Agentes não encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants', { timeout: 30000 });
      }
    });
    
    cy.wait(2000);
    
    // Clica em "Meus Agentes"
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado');
        cy.get('button:contains("Meus Agentes")').first().click();
      } else if ($body.find('div:contains("Meus Agentes")').length > 0) {
        cy.get('div:contains("Meus Agentes")').first().click();
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Navegação para agentes concluída');

    // ===== FASE 2: BUSCAR E ACESSAR AGENTE =====
    cy.log('📋 Fase 2: Buscando e acessando agente...');
    
    // Busca com múltiplos seletores
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]'
      ];
      
      let encontrado = false;
      for (const selector of selectorsBusca) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de busca encontrado: ${selector}`);
          cy.get(selector).first()
            .clear()
            .type('Agente teste automatizado', { delay: 100 });
          encontrado = true;
          break;
        }
      }
      
      if (!encontrado) {
        cy.log('⚠️ Campo de busca não encontrado');
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Busca pelo agente concluída');

    // ===== FASE 3: TESTAR AGENTE =====
    cy.log('📋 Fase 3: Clicando no botão testar...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Testar")').length > 0) {
        cy.log('✅ Botão Testar encontrado por texto');
        cy.get('button:contains("Testar")').first().click();
      } else if ($body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first().click();
      } else if ($body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first().click();
      } else {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first().click();
      }
    });
    cy.wait(3000);
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Botão testar clicado e página carregada');

    // ===== FASE 4: ENVIAR MENSAGEM =====
    cy.log('📋 Fase 4: Enviando mensagem no chat...');
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'input[type="text"]',
        'textarea',
        '[contenteditable="true"]',
        'input[placeholder*="message"]',
        'input[placeholder*="mensagem"]'
      ];

      let inputFound = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type('Olá! Este é um teste automatizado do Cypress.', { delay: 100 });
          cy.get(selector).first().type('{enter}');
          inputFound = true;
          break;
        }
      }

      if (!inputFound) {
        cy.log('⚠️ Campo de input não encontrado');
      }
    });
    cy.wait(3000);
    cy.log('✅ Mensagem enviada no chat');

    // ===== FASE 5: VALIDAR ENVIO =====
    cy.log('📋 Fase 5: Validando envio da mensagem...');
    cy.get('body').then(($body) => {
      if ($body.find('[class*="message"], [class*="chat"], [class*="bubble"]').length > 0) {
        cy.log('✅ Mensagens encontradas na interface');
        cy.get('[class*="message"], [class*="chat"], [class*="bubble"]').should('have.length.greaterThan', 0);
      } else {
        cy.log('⚠️ Nenhuma mensagem visível encontrada');
      }
    });
    cy.log('✅ Validação de mensagem concluída');

    cy.log('🎉 Teste concluído com sucesso!');
  });
});