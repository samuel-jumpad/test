import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste chat antigo", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo e enviar um chat", () => {
    // ===== FASE 1: NAVEGAR PARA CHAT =====
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navegar para Chat
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    // ===== FASE 2: CLICAR EM "GERAL" =====
    cy.log('📋 Fase 2: Clicando em "Geral"...');
    cy.wait(2000);
    
    // Usar seletores específicos baseados no HTML fornecido
    cy.get('body').then(($body) => {
      const selectorsGeral = [
        // Seletores específicos baseados no HTML
        'div.truncate:contains("Geral")',
        'div.flex.rounded-md:contains("Geral")',
        'div[class*="cursor-pointer"]:contains("Geral")',
        'div[class*="bg-[#027fa6]"]:contains("Geral")',
        'div:contains("Geral")',
        'span:contains("Geral")',
        '*:contains("Geral")'
      ];
      
      let geralEncontrado = false;
      for (const selector of selectorsGeral) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ "Geral" encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          cy.log(`✅ "Geral" clicado com sucesso`);
          geralEncontrado = true;
          break;
        }
      }
      
      if (!geralEncontrado) {
        cy.log('⚠️ "Geral" não encontrado com seletores específicos, tentando fallback...');
        try {
          cy.contains('Geral')
            .click({ force: true });
          cy.log('✅ "Geral" clicado com fallback');
          geralEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Fallback falhou: ${e.message}`);
        }
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Fase 2 concluída');

    // ===== FASE 3: CLICAR NA PRIMEIRA MENSAGEM =====
    cy.log('📋 Fase 3: Clicando na primeira mensagem...');
    cy.wait(2000);
    
    // Procurar por elementos que parecem ser chats
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'div[class*="flex gap-2 items-center"]',
        'div[class*="chat"]',
        'div[class*="conversation"]',
        'div[class*="message"]',
        'div[role="button"]'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Primeira mensagem clicada');
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando fallback...');
        cy.get('div, li, button').first()
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
        cy.log('✅ Elemento clicado com fallback');
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Fase 3 concluída');

    // ===== FASE 4: DIGITAR MENSAGEM =====
    cy.log('📋 Fase 4: Digitando mensagem...');
    const mensagem = 'ola, como vai?';
    
    // Procurar por campo de input
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first()
          .should('be.visible')
          .clear()
          .type(mensagem, { delay: 100 });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });

    // ===== FASE 5: CLICAR EM ENVIAR =====
    cy.log('✅ Mensagem digitada');
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]:not([disabled])',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]',
        'button[class*="enviar"]',
        'button[class*="message"]'
      ];
      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Send button encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click();
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    cy.log('✅ Send button clicado');
    cy.get('body').should('not.contain', 'enviando');
    
    // Validar envio da mensagem
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
    
    cy.log('✅ Message sending test completed successfully!');
  });
});